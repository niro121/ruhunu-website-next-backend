"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { GetPagesQuery, GetPagesReturn, Page, UpdatePageDTO } from "@/types/page"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// ========== Get all pages with pagination/search ==========
export const getPages = async ({
    page,
    limit,
    keyword,
}: GetPagesQuery) => {
    const skip = page * limit

    try {
        
        const user = await getLoggedInUser();

        const records = await prisma.page.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.page.count({
            where: {
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })
        
        const response: GetPagesReturn = {
            data: records,
            totalRecords,
        }
        
        return response

    } catch (error) {
        console.error("getPages error", error)
        throw new Error("Error getting Pages data")
    }
}

// ========== Create Page ==========
export const savePage = async (page: Page) => {

    try {

        const user = await getLoggedInUser(); //get logged user data
        
        const result = await prisma.page.create({
            data: {
                ...page,
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

// ========== Update Page ==========
export const updateOnePage = async (id: string, payload: UpdatePageDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data
        
        const result = await prisma.page.update({
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
        console.log("updateOnePage error ==> ", error)

        return {
            isError: false,
            error: "Update Page Error",
            data: null
        }
    }
}

// ========== Get single Page data ==========
export const getPageById = async (id: string) => {

    try {

        const result = await prisma.page.findUnique({
            where: { id: id },
        })
        
        return result
        
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Pages ==========
export const deletePages = async (ids: string[]) => {

    try {

        await prisma.page.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })
        
        return true

    } catch (error: any) {
        console.log("deletePages error ==> ", error)
        throw new Error(error.message ?? "Deleting Pages Error")
    }
}

// ========== Delete single Page ==========
export const deleteOnePage = async (id: string) => {
    try {

        await prisma.branche.delete({
            where: {
                id: id,
            },
        })

        return true

    } catch (error: any) {
        console.log("deleteOnePage error ==> ", error)
        throw new Error(error.message ?? "Delete Page Error")
    }
}
