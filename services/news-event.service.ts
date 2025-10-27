"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { GetNewsAndEventQuery, GetNewsAndEventsReturn, NewsAndEvent, UpdateNewsAndEventDTO } from "@/types/news-and-event";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// ========== Get all news & event with pagination/search ==========
export const getNewsAndEvent = async ({
    page,
    limit,
    keyword,
}: GetNewsAndEventQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser(); //get logged user data

        const records = await prisma.newsAndEvents.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.newsAndEvents.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })

        const response: GetNewsAndEventsReturn = {
            data: records,
            totalRecords,
        }

        return response
    } catch (error) {
        console.error("getNewsAndEvents error", error)
        throw new Error("Error getting NewsAndEvents data")
    }
}

// ========== Create news & event ==========
export const saveNewsAndEvent = async (newsAndEvent: NewsAndEvent) => {

    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.newsAndEvents.create({
            data: {
                ...newsAndEvent,
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
                    error: "News & Event with same slug already exists",
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

// ========== Update News & Event ==========
export const updateOneNewsAndEvent = async (id: string, payload: UpdateNewsAndEventDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.newsAndEvents.update({
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
        console.log("updateOneNewsAndEvent error ==> ", error)

        return {
            isError: false,
            error: "Update News & Event Error",
            data: null
        }
    }
}

// ========== Get single News & Event data ==========
export const getNewsAndEventById = async (id: string) => {

    try {
        const result = await prisma.newsAndEvents.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk News & Events ==========
export const deleteNewsAndEvents = async (ids: string[]) => {

    try {
        await prisma.newsAndEvents.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteNewsAndEvents error ==> ", error)
        throw new Error(error.message ?? "Deleting News & Events Error")
    }
}

// ========== Delete single News & Event ==========
export const deleteOneNewsAndEvent = async (id: string) => {
    try {
        await prisma.newsAndEvents.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneNewsAndEvent error ==> ", error)
        throw new Error(error.message ?? "Delete News & Event Error")
    }
}