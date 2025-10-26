"use server"

import { deleteBranches, deleteOneBranche, getBrancheById, getBranches, saveBranche, updateOneBranche } from "@/services/branches.service"
import { Branche, GetBranchesParams, GetBranchesQuery, UpdateBrancheDTO } from "@/types/branche"
import { revalidatePath } from "next/cache"


// ========== Get all branches with pagination/search ==========
export const getAllBranches = async (filter: GetBranchesParams) => {
    try {

        const newFilter: GetBranchesQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getBranches(newFilter)

    } catch (error: any) {
        console.error("getAllBranches error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create branche ==========
export const createNewBranche = async (payload: Branche) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("Branches name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set slug (if not provided)
        if (!payload.slug || payload.slug.trim() === "") {
            payload.slug = slugify(payload.name)
        }

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        // Call Service
        const savedData = await saveBranche(payload)

        revalidatePath('/Branches')

        return savedData

    } catch (error: any) {
        console.error("createNewBranches error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update branche ==========
export const updateBranche = async (id: string, payload: UpdateBrancheDTO) => {
    try {
        const updatedData = await updateOneBranche(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneBranches error ==> ", error)

        return {
            isError: false,
            error: "Update Branches Error",
            data: null
        }
    }
}

// ========== Get single Branche data ==========
export const fetchBrancheById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Branche id not found");
        }

        const Branche = await getBrancheById(id);

        if (!Branche) {
            throw new Error("Branche not found");
        }

        return Branche;
    } catch (error: any) {
        console.error("Error in fetch Branche ById:", error.message);
        throw new Error(error.message || "Unable to fetch Branche.");
    }
};


// ========== Delete bulk Branches ==========
export const bulkDeleteBranches = async (ids: string[]) => {

    try {

        await deleteBranches(ids)
        revalidatePath('/Branches')
        return true

    } catch (error: any) {
        console.log('bulkDeleteBranches error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single Branche ==========
export const deleteBranche = async (id: string) => {
    try {
        const response = await deleteOneBranche(id)
        revalidatePath('/Branches')
        return true

    } catch (error: any) {
        console.log('delete Branche error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}


// util
function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}