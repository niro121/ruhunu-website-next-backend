"use server"

import { deleteOnePage, deletePages, getPageById, getPages, savePage, updateOnePage } from "@/services/page.service"
import { GetPagesParams, GetPagesQuery, Page, UpdatePageDTO } from "@/types/page"
import { revalidatePath } from "next/cache"

// ========== Get all pages with pagination/search ==========
export const getAllPages = async (filter: GetPagesParams) => {
    try {

        const newFilter: GetPagesQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }
        
        // Call Service
        return await getPages(newFilter)

    } catch (error: any) {
        console.error("getAllPages error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create page ==========
export const createNewPage = async (payload: Page) => {

    try {

        // required validations
        if (!payload.title) {
            throw new Error("Pages name is required")
        }
        
        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt
        
        // Set slug (if not provided)
        if (!payload.slug || payload.slug.trim() === "") {
            payload.slug = slugify(payload.title)
        }
        
        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;
        
        // Call Service
        const savedData = await savePage(payload)
        
        revalidatePath('/cms-manager')
        
        return savedData

    } catch (error: any) {
        console.error("createNewPages error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update page ==========
export const updatePage = async (id: string, payload: UpdatePageDTO) => {
    try {
        const updatedData = await updateOnePage(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOnePage error ==> ", error)

        return {
            isError: false,
            error: "Update Page Error",
            data: null
        }
    }
}

// ========== Get single Page data ==========
export const fetchPageById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Page id not found");
        }

        const page = await getPageById(id);

        if (!page) {
            throw new Error("Page not found");
        }

        return page;
    } catch (error: any) {
        console.error("Error in fetch Page ById:", error.message);
        throw new Error(error.message || "Unable to fetch Page.");
    }
};

// ========== Delete bulk Pages ==========
export const bulkDeletePages = async (ids: string[]) => {

    try {

        await deletePages(ids)
        revalidatePath('/cms-manager')
        return true

    } catch (error: any) {
        console.log('bulkDeletePages error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single Page ==========
export const deletePage = async (id: string) => {
    try {
        const response = await deleteOnePage(id)
        revalidatePath('/cms-manager')
        return true

    } catch (error: any) {
        console.log('delete Page error ==>', error);
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