"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser"
import prisma from "@/lib/prisma"
import { GetServiceQuery, GetServiceReturn, Service, UpdateServiceDTO } from "@/types/service"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// ========== Get all services with pagination/search ==========
export const getServices = async ({
    page,
    limit,
    keyword,
}: GetServiceQuery) => {
    const skip = page * limit
    
    try {
    
        //const user = await getLoggedInUser(); //get logged user data
            
        const records = await prisma.service.findMany({
            skip,
            take: limit,
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
        })

        const totalRecords = await prisma.service.count({
            where: {
                OR: [
                    { name: { contains: keyword, mode: "insensitive" } },
                ],
            },
        })
                    
        const response: GetServiceReturn = {
            data: records,
            totalRecords,
        }
                    
        return response
    } catch (error) {
        console.error("getServices error", error)
        throw new Error("Error getting services data")
    }
}

// ========== Create service ==========
export const saveService = async (service: Service) => {

    try {

        const user = await getLoggedInUser();

        console.log({service})

        const result = await prisma.service.create({
            data: {
                ...service,
                phone: Array.isArray(service.phone) ? service.phone : [service.phone],
                email: Array.isArray(service.email) ? service.email : [service.email],
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

// ========== Update service ==========
export const updateOneService = async (id: string, payload: UpdateServiceDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        const result = await prisma.service.update({
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
        console.log("updateOneService error ==> ", error)

        return {
            isError: false,
            error: "Update service Error",
            data: null
        }
    }
}

// ========== Get single service data ==========
export const getServiceById = async (id: string) => {

    try {
        const result = await prisma.service.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk services ==========
export const deleteServices = async (ids: string[]) => {

    try {
        await prisma.service.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteServices error ==> ", error)
        throw new Error(error.message ?? "Deleting services Error")
    }
}

// ========== Delete single service ==========
export const deleteOneService = async (id: string) => {
    try {
        await prisma.service.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneService error ==> ", error)
        throw new Error(error.message ?? "Delete service Error")
    }
}