"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { GetRoomsQuery, GetRoomsReturn, Rooms, UpdateRoomDTO } from "@/types/room";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// ========== Get all rooms with pagination/search ==========
export const getRooms = async ({
    page,
    limit,
    keyword,
}: GetRoomsQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser(); //get logged user data

        const records = await prisma.room.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.room.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })

        const response: GetRoomsReturn = {
            data: records,
            totalRecords,
        }

        return response
    } catch (error) {
        console.error("getRooms error", error)
        throw new Error("Error getting Rooms data")
    }
}

// ========== Create room ==========
export const saveRoom = async (room: Rooms) => {

    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.room.create({
            data: {
                ...room,
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

// ========== Update Room ==========
export const updateOneRoom = async (id: string, payload: UpdateRoomDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.room.update({
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
        console.log("updateOneRooms error ==> ", error)

        return {
            isError: false,
            error: "Update Rooms Error",
            data: null
        }
    }
}

// ========== Get single Rooms data ==========
export const getRoomById = async (id: string) => {

    try {
        const result = await prisma.room.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Rooms ==========
export const deleteRooms = async (ids: string[]) => {

    try {
        await prisma.room.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteRooms error ==> ", error)
        throw new Error(error.message ?? "Deleting Rooms Error")
    }
}

// ========== Delete single Rooms ==========
export const deleteOneRoom = async (id: string) => {
    try {
        await prisma.room.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneRooms error ==> ", error)
        throw new Error(error.message ?? "Delete Rooms Error")
    }
}