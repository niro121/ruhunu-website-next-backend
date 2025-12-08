"use server"

import { deleteOneSection, deleteSections, getHero, getNextSectionOrder, getSection, getSectionById, saveSection, updateOneSection } from "@/services/section.service";
import { Section, UpdateSectionDTO } from "@/types/section";

// ========== Get Hero Section ==========
export const getHeroData = async (pageId: string) => {
    try {

        const data = await getHero(pageId);
        return data;

    } catch (error: any) {
        console.error("getHeroData error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Get All Section ==========
export const getAllSection = async (pageId: string) => {
    try {

        const data = await getSection(pageId);
        return data;

    } catch (error: any) {
        console.error("getHeroData error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Create Section ==========
export const createNewSection = async (payload: Section) => {
    try {
        // // required validations
        // if (!payload?.data?.title) {
        //     throw new Error("Section title is required")
        // }
        
        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt
        
        
        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;
        
        // Call Service
        const savedData = await saveSection(payload)
        
        // revalidatePath('/Branches')
        
        return savedData
        
    } catch (error: any) {
        console.error("createNewSection error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update Section ==========
export const updateSection = async (id: string,payload: UpdateSectionDTO) => {
    try {
        
        const updatedData = await updateOneSection(id,payload)
        return updatedData

    } catch (error: any) {
        console.error("updateSection error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}


// ========== Get single Section data ==========
export const fetchSectionById = async (id: string, type: string) => {

    try {
        if (!id) {
            throw new Error("Section id not found");
        }

        const section = await getSectionById(id,type);

        if (!section) {
            throw new Error("Sections not found");
        }

        return section;
    } catch (error: any) {
        console.error("Error in fetch Sections ById:", error.message);
        throw new Error(error.message || "Unable to fetch Section.");
    }
};

// ========== Delete bulk Section ==========
export const bulkDeleteSection = async (ids: string[]) => {

    try {

        await deleteSections(ids)
        //revalidatePath('/Section')
        return true

    } catch (error: any) {
        console.log('bulkDeleteSection error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single Section ==========
export const deleteSection = async (id: string) => {
    try {
        const response = await deleteOneSection(id)
        //revalidatePath('/Section')
        return true

    } catch (error: any) {
        console.log('delete Section error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}

export const getNextOrder = async (pageId: string) => {
    try {
        
        const order = await getNextSectionOrder(pageId);
        return order

    } catch (error: any) {
        console.log('getNextOrder ==>', error);
        throw new Error(error.message ?? "Error get Next Order. please try again later")
    }
}