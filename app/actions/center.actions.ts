"use server"

import { deleteCenters, deleteOneCenter, getCenterById, getCenters, saveCenter, updateOneCenter } from "@/services/center.service"
import { Center, GetCentersParams, GetCentersQuery, UpdateCenterDTO } from "@/types/center"
import { revalidatePath } from "next/cache"

// ========== Get all Center with pagination/search ==========
export const getAllCenters = async (filter: GetCentersParams) => {
    try {

        const newFilter: GetCentersQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getCenters(newFilter)

    } catch (error: any) {
        console.error("getAllCenter error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create Center ==========
export const createNewCenter = async (payload: Center) => {

    try {

        // required validations
        if (!payload.area) {
            throw new Error("Center area is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        // Call Service
        const savedData = await saveCenter(payload)

        revalidatePath('/collecting-centers')

        return savedData

    } catch (error: any) {
        console.error("createNewCenter error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update Center ==========
export const updateCenter = async (id: string, payload: UpdateCenterDTO) => {
    try {
        const updatedData = await updateOneCenter(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneCenter error ==> ", error)

        return {
            isError: false,
            error: "Update Center Error",
            data: null
        }
    }
}

// ========== Get single Center data ==========
export const fetchCenterById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Center id not found");
        }

        const center = await getCenterById(id);

        if (!center) {
            throw new Error("Center not found");
        }

        return center;
    } catch (error: any) {
        console.error("Error in fetch Center ById:", error.message);
        throw new Error(error.message || "Unable to fetch Center.");
    }
};


// ========== Delete bulk Center ==========
export const bulkDeleteCenters = async (ids: string[]) => {

    try {

        await deleteCenters(ids)
        revalidatePath('/collecting-centers')
        return true

    } catch (error: any) {
        console.log('bulkDeleteCenters error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single Center ==========
export const deleteCenter = async (id: string) => {
    try {
        const response = await deleteOneCenter(id)
        revalidatePath('/collecting-centers')
        return true

    } catch (error: any) {
        console.log('delete Center error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}