"use server"

import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library"
import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser"
import prisma from "@/lib/prisma"
import { GetMenuItemsQuery, GetMenuItemsReturn, MenuItem, UpdateMenuItemDTO } from "@/types/menu-items"

export const getMenuItems = async ({
    currentMenuId,
    page,
    limit,
    keyword,
}: GetMenuItemsQuery) => {
    const skip = page * limit

    try {
        
        const records = await prisma.menuItem.findMany({
            skip,
            take: limit,
            where: {menuId: currentMenuId},
            orderBy: { order: "asc"}
        })

        console.log({records})

        const totalRecords = await prisma.menuItem.count({
            where: {menuId: currentMenuId},
        });

        const response: GetMenuItemsReturn = {
            data: records,
            totalRecords: totalRecords
        };

        return response
    } catch (error) {
        console.error("getMenuItems error", error)
        throw new Error("Error getting menu items data")
    }
}

// ========== Create Menu Items ==========
export const saveMenuItems = async (menuitem: MenuItem) => {
    try {

        const user = await getLoggedInUser();

        console.log("sevices")

        const result = await prisma.menuItem.create({
            data: {
                ...menuitem,
                createdBy: user.id,
                createdAt: new Date()
            }
        })
        
        console.log({result})
                
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

// ========== update Menu Items ==========
export const updateOneMenuItem = async (id: string, payload: UpdateMenuItemDTO) => {
    try {
    
        const result = await prisma.menuItem.update({
            data: {
                ...payload,
                updatedAt: new Date()
            },
            where: {
                id: id,
            },
        })
    
        return {
            isE: true,
            error: "",
            data: result
        }
    
    } catch (error: any) {
        console.log("updateOneMenuItems error ==> ", error)
    
        return {
            isError: false,
            error: "update Menu Items Error",
            data: null
        }
    }
}

// ========== Get single Menu Items data ==========
export const getMenuItemsById = async (id: string) => {

    try {
        const result = await prisma.menuItem.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk careers application ==========
export const deleteMenuItems = async (ids: string[]) => {

    try {
        await prisma.menuItem.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteCareersApplication error ==> ", error)
        throw new Error(error.message ?? "Deleting careersApplication Error")
    }
}

// ========== Delete single career ==========
export const deleteOneMenuItem = async (id: string) => {
    try {
        await prisma.menuItem.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneMenuItems error ==> ", error)
        throw new Error(error.message ?? "Delete career Application Error")
    }
}

// ========== get menu items name and id ==========
export const getMenuItemsNameAndId = async (currentMenuId: string) => {
    try {
        const data = await prisma.menuItem.findMany({
            select: {
                id: true,
                title: true,
            },
            where: {menuId: currentMenuId},
            orderBy: { order: "asc"}
        })

        return data
        
    } catch (error: any) {
        console.log("getMenuItemsNameAndId error ==> ", error)
        throw new Error(error.message ?? "Get Menu Items Name And Id Error")
    }
}

// ================ get next menu item order ==============
export const getMenuItemOrder = async () => {
    try {
        const lastItem = await prisma.menuItem.findFirst({
            orderBy: { order: "desc" },
            select: { order: true },
        });

        // ✅ If there's no item yet, start from 1
        const nextOrder = lastItem?.order ? lastItem.order + 1 : 1;

        return nextOrder;

    } catch (error: any) {
        console.log("getMenuItemOrder error ==> ", error)
        throw new Error(error.message ?? "Get Menu Items Next Order Error")
    }
}

export const getOneTitleById = async (id: string) => {
    try {
        const selectTitle = await prisma.menuItem.findFirst({
            select: {title : true},
            where : {
                id: id
            }
        })

        return selectTitle;
        
    } catch (error: any) {
        console.log("getOneTitleById error ==> ", error)
        throw new Error(error.message ?? "Get Menu Items Next Order Error")
    }
}