"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { Branche, GetBranchesQuery, GetBranchesReturn, UpdateBrancheDTO } from "@/types/branche";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// ========== Get all branches with pagination/search ==========
export const getBranches = async ({
    page,
    limit,
    keyword,
}: GetBranchesQuery) => {
    const skip = page * limit

    try {

        const user = await getLoggedInUser(); //get logged user data

        const records = await prisma.branche.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.branche.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })

        const response: GetBranchesReturn = {
            data: records,
            totalRecords,
        }

        return response
    } catch (error) {
        console.error("getbranches error", error)
        throw new Error("Error getting branches data")
    }
}

// ========== Create branche ==========
export const saveBranche = async (branche: Branche) => {

    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.branche.create({
            data: {
                ...branche,
                phone: Array.isArray(branche.phone) ? branche.phone : [branche.phone],
                listImage: Array.isArray(branche.listImage) ? branche.listImage : [branche.listImage],
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
                    error: "Career with same slug already exists",
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

// ========== Update branche ==========
export const updateOneBranche = async (id: string, payload: UpdateBrancheDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.branche.update({
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
        console.log("updateOneBranche error ==> ", error)

        return {
            isError: false,
            error: "Update branche Error",
            data: null
        }
    }
}

// ========== Get single branche data ==========
export const getBrancheById = async (id: string) => {

    try {
        const result = await prisma.branche.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk branches ==========
export const deleteBranches = async (ids: string[]) => {

    try {
        await prisma.branche.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteBranches error ==> ", error)
        throw new Error(error.message ?? "Deleting branches Error")
    }
}

// ========== Delete single branche ==========
export const deleteOneBranche = async (id: string) => {
    try {
        await prisma.branche.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneBranche error ==> ", error)
        throw new Error(error.message ?? "Delete branche Error")
    }
}

export const getAllBranchesForDocter = async () => {
    try {
        const data = await prisma.branche.findMany({
            select :{
                id: true,name : true
            }
        })
        return data
    } catch (error: any) {
        console.log("deleteOneBranche error ==> ", error)
        throw new Error(error.message ?? "Delete branche Error")
    }
}