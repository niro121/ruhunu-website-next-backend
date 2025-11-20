"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { Section, UpdateSectionDTO } from "@/types/section";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// ========== Get Hero Section ==========
export const getHero = async (pageId: string) => {
    try {

        const result = await prisma.section.findFirst({
            where: {
                pageId: pageId,
                type: "Hero"
            }
        });

        return {
            isError: false,
            error: "",
            data: result
        };

    }  catch (error) {
        console.log("getHero error", error)
        throw new Error("Error getting data")
    }
}

// ========== Get All Section ==========
export const getSection = async (pageId: string) => {
    try {

        const result = await prisma.section.findMany({
            where: {
                pageId: pageId,
            }
        });

        return {
            isError: false,
            error: "",
            data: result
        };

    }  catch (error) {
        console.log("getHero error", error)
        throw new Error("Error getting data")
    }
}

// ========== Create Section ==========
export const saveSection = async (section: Section) => {

    section

    try {

        const user = await getLoggedInUser(); //get logged user data

        console.log({section})

        const result = await prisma.section.create({
            data: {
                type: section.type,
                layout: section.layout,
                order: section.order,
                data: section.data, // assuming JSON field
                pageId: section.pageId, // IMPORTANT
                visibility: section.visibility,
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

// ========== Update Section ==========
export const updateOneSection = async (id: string, payload: UpdateSectionDTO) => {
    try {
    
        const user = await getLoggedInUser(); //get logged user data

        console.log("id : ",id ,"payload : ", payload)
    
        const result = await prisma.section.update({
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
        console.log("updateOneSection error ==> ", error)
    
        return {
            isError: false,
            error: "Update service Error",
            data: null
        }
    }
}

// ========== Get single Section data ==========
export const getSectionById = async (id: string, type: string) => {

    console.log({id})

    try {
        const result = await prisma.section.findFirst({
            where: {
                pageId: id,
                type: type 
            },
        })
        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Sections ==========
export const deleteSections = async (ids: string[]) => {

    try {
        await prisma.section.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteSections error ==> ", error)
        throw new Error(error.message ?? "Deleting Sections Error")
    }
}

// ========== Delete single Section ==========
export const deleteOneSection = async (id: string) => {
    try {
        await prisma.section.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneSection error ==> ", error)
        throw new Error(error.message ?? "Delete Section Error")
    }
}

export const getNextSectionOrder = async (pageId: string) => {
    try {
        // Find the max order for the page
        const result = await prisma.section.aggregate({
            where: { pageId },
            _max: { order: true },
        });

        // If there is no section yet, start with 1
        const maxOrder = result._max.order ?? 0;

        // Return next order number
        console.log(maxOrder + 1)
        return maxOrder + 1;
    } catch (error: any) {
        console.log("getNextSectionOrder error ==> ", error)
        throw new Error(error.message ?? "Get Next Section Order Error")
    }
};