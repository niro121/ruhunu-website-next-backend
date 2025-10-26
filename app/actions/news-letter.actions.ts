"use server"

import { deleteNewsLetters, deleteOneNewsLetter, getNewsLetters } from "@/services/news-letter.service"
import { GetNewsLettersParams, GetNewsLettersQuery } from "@/types/news-letter"
import { revalidatePath } from "next/cache"

// ========== Get all news letters with pagination/search ==========
export const getAllNewsLetters = async (filter: GetNewsLettersParams) => {
    try {

        const newFilter: GetNewsLettersQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getNewsLetters(newFilter)

    } catch (error: any) {
        console.error("getAllNewsLetters error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Delete bulk news letters ==========
export const bulkDeleteNewsLetters = async (ids: string[]) => {

    try {

        await deleteNewsLetters(ids)
        revalidatePath('/news-letter-subcriptions')
        return true

    } catch (error: any) {
        console.log('bulkDeleteNewsLetters error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single news letter ==========
export const deleteNewsLetter = async (id: string) => {
    try {
        const response = await deleteOneNewsLetter(id)
        revalidatePath('/news-letter-subcriptions')
        return true

    } catch (error: any) {
        console.log('delete NewsLetter error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}