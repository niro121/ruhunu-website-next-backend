"use server"

import { deleteMenuItems, deleteOneMenuItem, getMenuItemOrder, getMenuItems, getMenuItemsById, getMenuItemsNameAndId, getOneTitleById, saveMenuItems, updateOneMenuItem } from "@/services/menuitem.service";
import { GetMenuItemsParams, GetMenuItemsQuery, MenuItem, UpdateMenuItemDTO } from "@/types/menu-items";
import { revalidatePath } from "next/cache";


// ========== Get all menu items with pagination/search ==========
export const getAllMenuItems = async (filter: GetMenuItemsParams) => {
    try {
        const newFilter: GetMenuItemsQuery = {
            currentMenuId: filter.currentMenuId,
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit): parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        };

        // Call Service
        return await getMenuItems(newFilter);
    } catch (error: any) {
        console.error("getAllMenuItems error", error);
        throw new Error(error.message ?? "Error getting data. Please try again later");
    }
}

export const createNewMenuItem = async (payload: MenuItem) => {
    try {

        // required validations
        if (!payload.title) {
            throw new Error("Menu name is required")
        }
        
        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt
        
        const savedData = await saveMenuItems(payload)
                
        revalidatePath('/menu-manager')
                
        return savedData
    } catch (error: any) {
        console.error("createNewMenu error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
} 

// ========== Update menu items ==========
export const updateMenuItems = async (id: string, payload: UpdateMenuItemDTO) => {
    try {

        console.log(id,payload)
        const updatedData = await updateOneMenuItem(id, payload);

        return updatedData;

    } catch (error: any) {
        console.log('update menu items error ==>', error);
            return {
                isError: true,
                errors: {
                    message: "Something went wrong. please try again later"
                },
                data: null
            }
    }
}

// ========== Get single menu items data ==========
export const fetchMenuItemsById = async (id: string) => {
    try {
        if (!id) {
            throw new Error("menu items id not found");
        }

        const menuitems = await getMenuItemsById(id);

        if (!menuitems) {
            throw new Error("MenuItems not found");
        }

        return menuitems;
    } catch (error: any) {
        console.error("Error in fetch Menu Items ById:", error.message);
        throw new Error(error.message || "Unable to fetch Menu Items.");
    }
}

// ========== Delete bulk menu items ==========
export const bulkDeleteMenuItems = async (ids: string[]) => {
    try {
        await deleteMenuItems(ids)
        return true
    } catch (error: any) {
        console.log('bulkDeleteMenuItems error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single menu items ==========
export const deleteMenuItem = async (id: string) => {
    try {
        const response = await deleteOneMenuItem(id)
        //revalidatePath('/career')
        return true
    } catch (error: any) {
        console.log('delete Menu Items error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// =========== get menu items name and id ===========
export const getAllMenuItemsNameId = async (currentMenuId: string) => {
    try {
        console.log({currentMenuId})
        const data = await getMenuItemsNameAndId(currentMenuId);
        return data;
    } catch (error: any) {
        console.log('getAllMenuItemsNameId error ==>', error);
        throw new Error(error.message ?? "Error getting records. please try again later")
    }
}

export const getNextMenuItemOrder = async () => {
    try {
        const order = getMenuItemOrder();
        return order;
    } catch (error: any) {
        console.log('getNextMenuItemOrder error ==>', error);
        throw new Error(error.message ?? "Error getting next MenuItem Order. please try again later")
    }
}

export const getTitleById = async (id: string) => {
    try {
        const title = getOneTitleById(id);
        return title;
    } catch (error: any) {
        console.log('getTitleById error ==>', error);
        throw new Error(error.message ?? "Error getting get Title By Id. please try again later")
    }
}