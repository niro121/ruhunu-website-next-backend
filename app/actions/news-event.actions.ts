"use server"

import { deleteNewsAndEvents, deleteOneNewsAndEvent, getNewsAndEvent, getNewsAndEventById, saveNewsAndEvent, updateOneNewsAndEvent } from "@/services/news-event.service"
import { GetNewsAndEventParams, GetNewsAndEventQuery, NewsAndEvent, UpdateNewsAndEventDTO } from "@/types/news-and-event"
import { revalidatePath } from "next/cache"

// ========== Get all news & event with pagination/search ==========
export const getAllNewsAndEvent = async (filter: GetNewsAndEventParams) => {
    try {

        const newFilter: GetNewsAndEventQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getNewsAndEvent(newFilter)

    } catch (error: any) {
        console.error("getAllNewsAndEvent error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create News & Event ==========
export const createNewNewsAndEvent = async (payload: NewsAndEvent) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("NewsAndEvent name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        // Call Service
        const savedData = await saveNewsAndEvent(payload)

        revalidatePath('/NewsAndEvent')

        return savedData

    } catch (error: any) {
        console.error("createNewNewsAndEvent error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update News & Event ==========
export const updateNewsAndEvent = async (id: string, payload: UpdateNewsAndEventDTO) => {
    try {
        const updatedData = await updateOneNewsAndEvent(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneNewsAndEvent error ==> ", error)

        return {
            isError: false,
            error: "Update NewsAndEvent Error",
            data: null
        }
    }
}

// ========== Get single News & Event data ==========
export const fetchNewsAndEventById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("NewsAndEvent id not found");
        }

        const NewsAndEvent = await getNewsAndEventById(id);

        if (!NewsAndEvent) {
            throw new Error("NewsAndEvent not found");
        }

        return NewsAndEvent;
    } catch (error: any) {
        console.error("Error in fetch NewsAndEvent ById:", error.message);
        throw new Error(error.message || "Unable to fetch NewsAndEvent.");
    }
};


// ========== Delete bulk News & Event ==========
export const bulkDeleteNewsAndEvent = async (ids: string[]) => {

    try {

        await deleteNewsAndEvents(ids)
        revalidatePath('/NewsAndEvent')
        return true

    } catch (error: any) {
        console.log('bulkDeleteNewsAndEvent error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single News & Event ==========
export const deleteNewsAndEvent = async (id: string) => {
    try {
        const response = await deleteOneNewsAndEvent(id)
        revalidatePath('/NewsAndEvent')
        return true

    } catch (error: any) {
        console.log('delete NewsAndEvent error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}