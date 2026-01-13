"use server"

import { deleteOneSpeciality, deleteSpecialitys, getAllSpecialitysForDocter, getLastSpeciality, getSpecialityById, getSpecialitys, saveSpeciality, updateOneSpeciality } from "@/services/speciality.service"
import { GetSpecialitysParams, GetSpecialitysQuery, Speciality, UpdateSpecialityDTO } from "@/types/speciality"
import { revalidatePath } from "next/cache"

// ========== Get all Specialitys with pagination/search ==========
export const getAllSpecialitys = async (filter: GetSpecialitysParams) => {
    try {

        const newFilter: GetSpecialitysQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getSpecialitys(newFilter)

    } catch (error: any) {
        console.error("getAllSpecialitys error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create Speciality ==========
export const createNewSpeciality = async (payload: Speciality) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("Specialitys name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt
        delete (payload as any).code


        if (payload.visibility === undefined) payload.visibility = false;

        // ===== Auto-generate code =====
        const lastSpeciality = await getLastSpeciality() // implement this function to get the last saved speciality
        let newNumber = 1

        if (lastSpeciality?.code) {
            // Extract the number part from last code, e.g., 'RHC032' -> 32
            const matches = lastSpeciality.code.match(/\d+$/)
            if (matches) {
                newNumber = parseInt(matches[0], 10) + 1
            }
        }

        // Format number to 3 digits with leading zeros
        const newCode = `RHC${String(newNumber).padStart(3, "0")}`
        payload.code = newCode

        // Call Service
        const savedData = await saveSpeciality(payload)

        revalidatePath('/speciality')

        return savedData

    } catch (error: any) {
        console.error("createNewSpecialitys error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update Speciality ==========
export const updateSpeciality = async (id: string, payload: UpdateSpecialityDTO) => {
    try {
        const updatedData = await updateOneSpeciality(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneSpecialitys error ==> ", error)

        return {
            isError: false,
            error: "Update Specialitys Error",
            data: null
        }
    }
}

// ========== Get single Speciality data ==========
export const fetchSpecialityById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Speciality id not found");
        }

        const Speciality = await getSpecialityById(id);

        if (!Speciality) {
            throw new Error("Speciality not found");
        }

        return Speciality;
    } catch (error: any) {
        console.error("Error in fetch Speciality ById:", error.message);
        throw new Error(error.message || "Unable to fetch Speciality.");
    }
};


// ========== Delete bulk Specialitys ==========
export const bulkDeleteSpecialitys = async (ids: string[]) => {

    try {

        await deleteSpecialitys(ids)
        revalidatePath('/speciality')
        return true

    } catch (error: any) {
        console.log('bulkDeleteSpecialitys error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single Speciality ==========
export const deleteSpeciality = async (id: string) => {
    try {
        const response = await deleteOneSpeciality(id)
        revalidatePath('/Specialitys')
        return true

    } catch (error: any) {
        console.log('delete Speciality error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}

export const getAllSpecialitysToDocter = async () => {
    try {
        const response = await getAllSpecialitysForDocter();
        return response;
    } catch (error: any) {
        console.log('get All Specialitys To Docter  error ==>', error);
        throw new Error(error.message ?? "Error geting data. please try again later")
    }
}