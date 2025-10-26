"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { GetNewsLettersQuery, GetNewsLettersReturn } from "@/types/news-letter";

// ========== Get all news letters with pagination/search ==========
export const getNewsLetters = async ({
    page,
    limit,
    keyword,
}: GetNewsLettersQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser(); //get logged user data

        const records = await prisma.newsLetter.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { email: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.newsLetter.count({
            where: {
                OR: [
                    { email: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })

        const response: GetNewsLettersReturn = {
            data: records,
            totalRecords,
        }

        return response
    } catch (error) {
        console.error("getNewsLetters error", error)
        throw new Error("Error getting news letters data")
    }
}

// ========== Delete bulk news letters ==========
export const deleteNewsLetters = async (ids: string[]) => {

    try {
        await prisma.newsLetter.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteNewsLetters error ==> ", error)
        throw new Error(error.message ?? "Deleting news letters Error")
    }
}

// ========== Delete single news letters ==========
export const deleteOneNewsLetter = async (id: string) => {
    try {
        await prisma.newsLetter.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneNewsLetters error ==> ", error)
        throw new Error(error.message ?? "Delete news letters Error")
    }
}