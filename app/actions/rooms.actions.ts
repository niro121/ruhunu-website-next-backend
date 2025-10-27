"use server"

import { deleteOneRoom, deleteRooms, getRoomById, getRooms, saveRoom, updateOneRoom } from "@/services/rooms.service"
import { GetRoomsParams, GetRoomsQuery, Rooms, UpdateRoomDTO } from "@/types/room"
import { revalidatePath } from "next/cache"

// ========== Get all rooms with pagination/search ==========
export const getAllRooms = async (filter: GetRoomsParams) => {
    try {

        const newFilter: GetRoomsQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getRooms(newFilter)

    } catch (error: any) {
        console.error("getAllRooms error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create rooms ==========
export const createNewRoom = async (payload: Rooms) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("Rooms name is required")
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
        const savedData = await saveRoom(payload)

        revalidatePath('/rooms')

        return savedData

    } catch (error: any) {
        console.error("createNewRooms error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update room ==========
export const updateRoom = async (id: string, payload: UpdateRoomDTO) => {
    try {
        const updatedData = await updateOneRoom(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneRooms error ==> ", error)

        return {
            isError: false,
            error: "Update Rooms Error",
            data: null
        }
    }
}

// ========== Get single room data ==========
export const fetchRoomById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("Rooms id not found");
        }

        const Rooms = await getRoomById(id);

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
export const bulkDeleteRooms = async (ids: string[]) => {

    try {

        await deleteRooms(ids)
        revalidatePath('/rooms')
        return true

    } catch (error: any) {
        console.log('bulkDeleteRooms error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single room ==========
export const deleteRoom = async (id: string) => {
    try {
        const response = await deleteOneRoom(id)
        revalidatePath('/rooms')
        return true

    } catch (error: any) {
        console.log('delete Rooms error ==>', error);
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