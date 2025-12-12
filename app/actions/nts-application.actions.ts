"use server"

import { deleteApplications, deleteOneApplication, getApplicationById, getApplications, saveApplication, updateOneApplication } from "@/services/nts-application.service";
import { NtsApplication, GetNtsApplicationParams, GetNtsApplicationQuery, UpdateNtsApplicationDTO, } from "@/types/ntsapplication";
import { revalidatePath } from "next/cache";

// ========== Get all Applications with pagination/search ==========
export const getAllApplications = async (filter: GetNtsApplicationParams) => {
    try {

        const newFilter: GetNtsApplicationQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getApplications(newFilter)

    } catch (error: any) {
        console.error("getAllApplications error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create Application ==========
export const createNewApplication = async (payload: NtsApplication) => {

    try {

        // required validations
        if (!payload.full_name) {
            throw new Error("Applicant full name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Call Service
        const savedData = await saveApplication(payload)

        revalidatePath('/nts')

        return savedData

    } catch (error: any) {
        console.error("createNewApplication error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Get single Application data ==========
export const fetchApplicationById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Docter id not found");
        }

        const docter = await getApplicationById(id);

        if (!docter) {
            throw new Error("Docter not found");
        }

        return docter;
    } catch (error: any) {
        console.error("Error in fetch docter ById:", error.message);
        throw new Error(error.message || "Unable to fetch docter.");
    }
};


// ========== Update Application ==========
export const updateApplication = async (id: string, payload: UpdateNtsApplicationDTO) => {
    try {
        const updatedData = await updateOneApplication(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneApplication error ==> ", error)

        return {
            isError: false,
            error: "Update Application Error",
            data: null
        }
    }
}

// ========== Delete bulk Applications ==========
export const bulkDeleteApplications = async (ids: string[]) => {

    try {

        await deleteApplications(ids)
        revalidatePath('/nts')
        return true

    } catch (error: any) {
        console.log('bulkDeleteApplications error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single Applications ==========
export const deleteApplication = async (id: string) => {
    try {
        const response = await deleteOneApplication(id)
        revalidatePath('/nts')
        return true

    } catch (error: any) {
        console.log('delete Application error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}