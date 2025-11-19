"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { GetRoomsCategoryQuery, GetRoomsCategoryReturn, RoomsCategory, UpdateRoomsCategoryDTO } from "@/types/rooms-category";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// ========== Get all room category with pagination/search ==========
export const getRoomCategorys = async ({
    page,
    limit,
    keyword,
}: GetRoomsCategoryQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser(); //get logged user data

        const records = await prisma.roomsCategory.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.roomsCategory.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })

        const response: GetRoomsCategoryReturn = {
            data: records,
            totalRecords,
        }

        return response
    } catch (error) {
        console.error("getRooms error", error)
        throw new Error("Error getting Rooms data")
    }
}

// ========== Create room category ==========
export const saveRoomCategory = async (roomCategory: RoomsCategory) => {

    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.roomsCategory.create({
            data: {
                ...roomCategory,
                createdBy: user.id,
                createdAt: new Date()
            }
        })

        return {
            isError: false,
            error: "",
            data: result
        }

    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {

            if (error.code === "P2002") {

                return {
                    isError: true,
                    error: "Room with same slug already exists",
                    data: null
                }
            }

        }

        return {
            isError: false,
            error: "",
            data: null
        }
    }
}

// ========== Update Room category ==========
export const updateOneRoomCategory = async (id: string, payload: UpdateRoomsCategoryDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.roomsCategory.update({
            data: {
                ...payload,
                updatedBy: user.id,
                updatedAt: new Date()
            },
            where: {
                id: id,
            },
        })

        return {
            isError: false,
            error: "",
            data: result
        }
    } catch (error: any) {
        console.log("updateOneRoomsCategory error ==> ", error)

        return {
            isError: false,
            error: "Update Rooms category Error",
            data: null
        }
    }
}

// ========== Get single Rooms category data ==========
export const getRoomCategoryById = async (id: string) => {

    try {
        const result = await prisma.roomsCategory.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Rooms category ==========
export const deleteRoomCategorys = async (ids: string[]) => {

    try {
        await prisma.roomsCategory.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteRoomsCategory error ==> ", error)
        throw new Error(error.message ?? "Deleting Rooms Category Error")
    }
}

// ========== Delete single Rooms Category ==========
export const deleteOneRoomCategory = async (id: string) => {
    try {
        await prisma.roomsCategory.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneRoomsCategory error ==> ", error)
        throw new Error(error.message ?? "Delete Rooms Category Error")
    }
}

export const getAllCategoryNames = async () => {
    try {
        const result = await prisma.roomsCategory.findMany({
            select: {
                name: true,
            },
        })

        return result;
    } catch (error: any) {
        console.log("getAllCategoryNames error ==> ", error)
        throw new Error(error.message ?? "get All Category Names Error")
    }
}