"use server"

import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { NtsApplication, GetNtsApplicationQuery, GetNtsApplicationReturn, UpdateNtsApplicationDTO } from "@/types/ntsapplication";


// ========== Get all Applications with pagination/search ==========
export const getDocters = async ({
    page,
    limit,
    keyword,
}: GetNtsApplicationQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser(); //get logged user data

        const records = await prisma.ntsApplication.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { full_name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.ntsApplication.count({
            where: {
                OR: [
                    { full_name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })

        const response: GetNtsApplicationReturn = {
            data: records,
            totalRecords,
        }

        return response
    } catch (error) {
        console.error("getApplications error", error)
        throw new Error("Error getting application data")
    }
}

// ========== Get single Application data ==========
export const getApplicationById = async (id: string) => {

    try {
        const result = await prisma.ntsApplication.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Applications ==========
export const deleteApplications = async (ids: string[]) => {

    try {
        await prisma.ntsApplication.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteDocters error ==> ", error)
        throw new Error(error.message ?? "Deleting Docters Error")
    }
}

// ========== Delete single Application ==========
export const deleteOneApplication = async (id: string) => {
    try {
        await prisma.ntsApplication.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneDocter error ==> ", error)
        throw new Error(error.message ?? "Delete Docter Error")
    }
}