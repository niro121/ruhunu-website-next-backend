"use server"

import { deleteOneService, deleteServices, getServiceById, getServices, saveService, updateOneService } from "@/services/services.service"
import { GetServiceParams, GetServiceQuery, Service, UpdateServiceDTO } from "@/types/service"
import { revalidatePath } from "next/cache"

// ========== Get all services with pagination/search ==========
export const getAllservices = async (filter: GetServiceParams) => {
    try {

        const newFilter: GetServiceQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        }

        // Call Service
        return await getServices(newFilter)

    } catch (error: any) {
        console.error("getAllService error", error)
        throw new Error(error.message ?? "Error getting data. please try again later")
    }
}

// ========== Create service ==========
export const createNewService = async (payload: Service) => {

    try {

        // required validations
        if (!payload.name) {
            throw new Error("services name is required")
        }

        delete (payload as any).id
        delete (payload as any).createdAt
        delete (payload as any).updatedAt

        // Set slug (if not provided)
        if (!payload.slug || payload.slug.trim() === "") {
            payload.slug = slugify(payload.name)
        }

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        console.log({payload})
        // Call Service
        const savedData = await saveService(payload)

        console.log({savedData})

        revalidatePath('/services')

        return savedData

    } catch (error: any) {
        console.error("createNewServices error ==>", error)
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. please try again later" },
            data: null,
        }
    }
}

// ========== Update service ==========
export const updateService = async (id: string, payload: UpdateServiceDTO) => {
    try {
        const updatedData = await updateOneService(id, payload)

        return updatedData
    } catch (error: any) {
        console.log("updateOneServices error ==> ", error)

        return {
            isError: false,
            error: "Update services Error",
            data: null
        }
    }
}

// ========== Get single service data ==========
export const fetchServiceById = async (id: string) => {

    try {
        if (!id) {
            throw new Error("service id not found");
        }

        const service = await getServiceById(id);

        if (!service) {
            throw new Error("service not found");
        }

        return service;
    } catch (error: any) {
        console.error("Error in fetch Service ById:", error.message);
        throw new Error(error.message || "Unable to fetch Service.");
    }
};


// ========== Delete bulk services ==========
export const bulkDeleteServices = async (ids: string[]) => {

    try {

        await deleteServices(ids)
        revalidatePath('/services')
        return true

    } catch (error: any) {
        console.log('bulkDeleteServices error ==>', error);
        throw new Error(error.message ?? "Error deleting records. please try again later")
    }
}

// ========== Delete single service ==========
export const deleteService = async (id: string) => {
    try {
        const response = await deleteOneService(id)
        revalidatePath('/services')
        return true

    } catch (error: any) {
        console.log('delete service error ==>', error);
        throw new Error(error.message ?? "Error deleting data. please try again later")
    }
}

// util
function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/['"]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}