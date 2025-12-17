"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import {
    GetTestimonialQuery,
    GetTestimonialReturn,
    Testimonial,
    UpdateTestimonialDTO,
} from "@/types/testimonial";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// ========== Get all testimonials with pagination/search ==========
export const getTestimonials = async ({
    page,
    limit,
    keyword,
}: GetTestimonialQuery) => {
    const skip = page * limit;

    try {
        const user = await getLoggedInUser();

        const records = await prisma.testimonial.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { designation: { contains: keyword, mode: "insensitive" } },
                    { testimonial: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        });

        const totalRecords = await prisma.testimonial.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                    { designation: { contains: keyword, mode: "insensitive" } },
                    { testimonial: { contains: keyword, mode: "insensitive" } },
                ],
            },
        });

        const response: GetTestimonialReturn = {
            data: records,
            totalRecords,
        };

        return response;
    } catch (error) {
        console.error("getTestimonials error", error);
        throw new Error("Error getting testimonial data");
    }
};

// ========== Create testimonial ==========
export const saveTestimonial = async (testimonial: Testimonial) => {
    try {
        const user = await getLoggedInUser();

        const result = await prisma.testimonial.create({
            data: {
                ...testimonial,
                createdBy: user.id,
                createdAt: new Date(),
            },
        });

        return {
            isError: false,
            error: "",
            data: result,
        };
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            // Example: handle unique constraint violation if needed
            if (error.code === "P2002") {
                return {
                    isError: true,
                    error: "Duplicate testimonial entry",
                    data: null,
                };
            }
        }

        console.error("saveTestimonial error", error);
        return {
            isError: true,
            error: "Error creating testimonial",
            data: null,
        };
    }
};

// ========== Update testimonial ==========
export const updateOneTestimonial = async (id: string, payload: UpdateTestimonialDTO) => {
    try {
        const user = await getLoggedInUser();

        const result = await prisma.testimonial.update({
            data: {
                ...payload,
                updatedBy: user.id,
                updatedAt: new Date(),
            },
            where: { id },
        });

        return {
            isError: false,
            error: "",
            data: result,
        };
    } catch (error: any) {
        console.error("updateOneTestimonial error ==> ", error);
        return {
            isError: true,
            error: "Update testimonial error",
            data: null,
        };
    }
};

// ========== Get single testimonial ==========
export const getTestimonialById = async (id: string) => {
    try {
        const result = await prisma.testimonial.findUnique({
            where: { id },
        });

        return result;
    } catch (error: any) {
        throw new Error(error.message ?? "Error fetching testimonial");
    }
};

// ========== Delete multiple testimonials ==========
export const deleteTestimonials = async (ids: string[]) => {
    try {
        await prisma.testimonial.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return true;
    } catch (error: any) {
        console.error("deleteTestimonials error ==> ", error);
        throw new Error(error.message ?? "Deleting testimonials error");
    }
};

// ========== Delete single testimonial ==========
export const deleteOneTestimonial = async (id: string) => {
    try {
        await prisma.testimonial.delete({
            where: { id },
        });
        return true;
    } catch (error: any) {
        console.error("deleteOneTestimonial error ==> ", error);
        throw new Error(error.message ?? "Delete testimonial error");
    }
};

// ========== Get all testimonial names (or authors) ==========
export const getAllTestimonialNames = async () => {
    try {
        const result = await prisma.testimonial.findMany({
            select: {
                name: true,
            },
        });

        return result;
    } catch (error: any) {
        console.error("getAllTestimonialNames error ==> ", error);
        throw new Error(error.message ?? "Get all testimonial names error");
    }
};
