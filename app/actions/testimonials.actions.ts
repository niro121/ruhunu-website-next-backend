"use server";

import {
    deleteOneTestimonial,
    deleteTestimonials,
    getAllTestimonialNames,
    getTestimonialById,
    getTestimonials,
    saveTestimonial,
    updateOneTestimonial,
} from "@/services/testimonial.service";

import {
    GetTestimonialParams,
    GetTestimonialQuery,
    Testimonial,
    UpdateTestimonialDTO,
} from "@/types/testimonial";

import { revalidatePath } from "next/cache";

// ========== Get all testimonials with pagination/search ==========
export const getAllTestimonials = async (filter: GetTestimonialParams) => {
    try {
        const newFilter: GetTestimonialQuery = {
            page: filter.page ? parseInt(filter.page) : 0,
            limit: filter.limit
                ? parseInt(filter.limit)
                : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
            keyword: filter.keyword ?? "",
        };

        // Call Service
        return await getTestimonials(newFilter);
    } catch (error: any) {
        console.error("getAllTestimonials error", error);
        throw new Error(
            error.message ?? "Error getting testimonial data. Please try again later."
        );
    }
};

// ========== Create new testimonial ==========
export const createNewTestimonial = async (payload: Testimonial) => {
    try {
        // required validations
        if (!payload.name) {
            throw new Error("Testimonial name is required");
        }

        delete (payload as any).id;
        delete (payload as any).createdAt;
        delete (payload as any).updatedAt;

        // Set defaults
        if (payload.visibility === undefined) payload.visibility = false;

        // Call Service
        const savedData = await saveTestimonial(payload);

        revalidatePath("/testimonials");

        return savedData;
    } catch (error: any) {
        console.error("createNewTestimonial error ==>", error);
        return {
            isError: true,
            errors: { message: error.message ?? "Something went wrong. Please try again later." },
            data: null,
        };
    }
};

// ========== Update testimonial ==========
export const updateTestimonial = async (id: string, payload: UpdateTestimonialDTO) => {
    try {
        const updatedData = await updateOneTestimonial(id, payload);
        return updatedData;
    } catch (error: any) {
        console.log("updateTestimonial error ==> ", error);
        return {
            isError: true,
            error: "Update testimonial error",
            data: null,
        };
    }
};

// ========== Get single testimonial ==========
export const fetchTestimonialById = async (id: string) => {
    try {
        if (!id) {
            throw new Error("Testimonial id not found");
        }

        const testimonial = await getTestimonialById(id);

        if (!testimonial) {
            throw new Error("Testimonial not found");
        }

        return testimonial;
    } catch (error: any) {
        console.error("Error in fetchTestimonialById:", error.message);
        throw new Error(error.message || "Unable to fetch testimonial.");
    }
};

// ========== Delete multiple testimonials ==========
export const bulkDeleteTestimonials = async (ids: string[]) => {
    try {
        await deleteTestimonials(ids);
        revalidatePath("/testimonials");
        return true;
    } catch (error: any) {
        console.log("bulkDeleteTestimonials error ==>", error);
        throw new Error(error.message ?? "Error deleting testimonials. Please try again later.");
    }
};

// ========== Delete single testimonial ==========
export const deleteSingleTestimonial = async (id: string) => {
    try {
        await deleteOneTestimonial(id);
        revalidatePath("/testimonials");
        return true;
    } catch (error: any) {
        console.log("deleteSingleTestimonial error ==>", error);
        throw new Error(error.message ?? "Error deleting testimonial. Please try again later.");
    }
};

// ========== Get all testimonial author names ==========
export const getAllTestimonialNamesAction = async () => {
    try {
        const response = await getAllTestimonialNames();
        return response;
    } catch (error: any) {
        console.log("getAllTestimonialNamesAction error ==>", error);
        throw new Error(error.message ?? "Error fetching all testimonial names");
    }
};
