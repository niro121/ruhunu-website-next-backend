"use server"

import { deleteOneRoomCategory, deleteRoomCategorys, getAllCategoryNames, getRoomCategoryById, getRoomCategorys, saveRoomCategory, updateOneRoomCategory } from "@/services/rooms-category.service"
import { GetRoomsCategoryParams, GetRoomsCategoryQuery, RoomsCategory, UpdateRoomsCategoryDTO } from "@/types/rooms-category"
import { revalidatePath } from "next/cache"

// ========== Get all room category with pagination/search ==========
export const getAllRoomCategorys = async (filter: GetRoomsCategoryParams) => {
    try {

        const newFilter: GetRoomsCategoryQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getRoomCategorys(newFilter)

    } catch (error: any) {
        console.error("getAllRooms error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create rooms category ==========
export const createNewRoomCategory = async (payload: RoomsCategory) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("Rooms name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        // Call Service
        const savedData = await saveRoomCategory(payload)

        revalidatePath('/room-categorys')

        return savedData

    } catch (error: any) {
        console.error("createNewRoomsCategory error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update room ==========
export const updateRoomCategory = async (id: string, payload: UpdateRoomsCategoryDTO) => {
    try {
        const updatedData = await updateOneRoomCategory(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneRoomsCategory error ==> ", error)

        return {
            isError: false,
            error: "Update Rooms Category Error",
            data: null
        }
    }
}

// ========== Get single room data ==========
export const fetchRoomCategoryById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Rooms id not found");
        }

        const Rooms = await getRoomCategoryById(id);

        if (!Rooms) {
            throw new Error("Rooms not found");
        }

        return Rooms;
    } catch (error: any) {
        console.error("Error in fetch Rooms ById:", error.message);
        throw new Error(error.message || "Unable to fetch Rooms.");
    }
};


// ========== Delete bulk rooms ==========
export const bulkDeleteRoomCategorys = async (ids: string[]) => {

    try {

        await deleteRoomCategorys(ids)
        revalidatePath('/room-categorys')
        return true

    } catch (error: any) {
        console.log('bulkDeleteRooms error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single room ==========
export const deleteRoomCategory = async (id: string) => {
    try {
        const response = await deleteOneRoomCategory(id)
        revalidatePath('/room-categorys')
        return true

    } catch (error: any) {
        console.log('delete Rooms Category error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}

export const getAllRoomCategoryNames = async () => {
    try {
        const response = await getAllCategoryNames()
        return response;

    } catch (error: any) {
        console.log('getAllRoomCategoryNames error ==>', error);
        throw new Error(error.message ?? "Error get All Room Category Names")
    }
}