"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import { Center, GetCentersQuery, GetCentersReturn, UpdateCenterDTO } from "@/types/center"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// ========== Get all Collecting Centers ==========
export const getCenters = async ({
    page,
    limit,
    keyword,
}: GetCentersQuery) => {

    const skip = page * limit
    try {
        await getLoggedInUser();

        const records = await prisma.collectingCenter.findMany({
            skip,
            take: limit,
            include: { centers: true },
            orderBy: { createdAt: "desc" },
        });

        const totalRecords = await prisma.collectingCenter.count({
            where: {
                OR: [
                    { area: { contains: keyword, mode: "insensitive" } },
                ],
            },
        });

        const response: GetCentersReturn = {
            data: records,
            totalRecords,
        };

        return response;
    } catch (error) {
        console.error("getCenters error", error);
        throw new Error("Error getting Centers data");
    }
};

// ========== Create Collecting Center ==========
export const saveCenter = async (center: Center) => {
    try {
        const user = await getLoggedInUser();

        const result = await prisma.collectingCenter.create({
            data: {
                area: center.area,
                visibility: center.visibility,
                createdBy: user.id,
                createdAt: new Date(),
                centers: {
                    create: center.centers?.map(c => ({
                        centerName: c.centerName,
                        address: c.address ?? "",
                        phone: c.phone ?? "",
                    })) ?? []
                }
            },
            include: { centers: true }
        });

        return { isError: false, error: "", data: result };

    } catch (error: any) {
        console.log("saveCenter error =>", error);

        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            return { isError: true, error: "Collecting Center Already Exists", data: null };
        }

        return { isError: true, error: "Unexpected Error Occurred", data: null };
    }
};

// ========== Update Collecting Center ==========
export const updateOneCenter = async (id: string, payload: UpdateCenterDTO) => {
    try {
        const user = await getLoggedInUser();

        // Remove old center locations
        await prisma.centerLocation.deleteMany({
            where: { collectingCenterId: id }
        });

        const result = await prisma.collectingCenter.update({
            where: { id },
            data: {
                area: payload.area,
                visibility: payload.visibility,
                updatedBy: user.id,
                updatedAt: new Date(),
                centers: {
                    create: payload.centers?.map(c => ({
                        centerName: c.centerName,
                        address: c.address ?? "",
                        phone: c.phone ?? "",
                    })) ?? []
                }
            },
            include: { centers: true }
        });

        return { isError: false, error: "", data: result };

    } catch (error) {
        console.log("updateOneCenter error ==> ", error);
        return { isError: true, error: "Update Center Error", data: null };
    }
};

// ========== Get Single Collecting Center ==========
export const getCenterById = async (id: string) => {
    try {
        return await prisma.collectingCenter.findUnique({
            where: { id },
            include: { centers: true }
        });

    } catch (error: any) {
        throw new Error(error.message ?? "");
    }
};

// ========== Delete Multiple ==========
export const deleteCenters = async (ids: string[]) => {
    try {

        // Step 1: Delete related CenterLocation entries
        await prisma.centerLocation.deleteMany({
            where: {
                collectingCenterId: { in: ids }
            }
        });

        // Step 2: Delete CollectingCenters
        await prisma.collectingCenter.deleteMany({
            where: { id: { in: ids } },
        });

        return true;

    } catch (error: any) {
        console.log("deleteCenters error ==> ", error);
        throw new Error(error.message ?? "Deleting Centers Error");
    }
};


// ========== Delete Single ==========
export const deleteOneCenter = async (id: string) => {
    try {
        // 1. Delete related locations first
        await prisma.centerLocation.deleteMany({
            where: { collectingCenterId: id },
        });

        // 2. Delete the center
        await prisma.collectingCenter.delete({
            where: { id },
        });

        return true;

    } catch (error: any) {
        console.log("deleteOneCenter error ==> ", error);
        throw new Error(error.message ?? "Delete Center Error");
    }
};
