"use server"

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser"
import prisma from "@/lib/prisma"
import { GetSpecialitysQuery, GetSpecialitysReturn, Speciality, UpdateSpecialityDTO } from "@/types/speciality"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const getSpecialitys = async ({
    page,
    limit,
    keyword,
}: GetSpecialitysQuery) => {
    const skip = page * limit

    try {
        const records = await prisma.speciality.findMany({
            skip: skip,
            take: limit,
            where: {
                name: {
                    contains: keyword,
                    mode: "insensitive"
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        const totalRecords = await prisma.user.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: keyword,
                        },
                    },
                    {
                        email: {
                            contains: keyword,
                        },
                    },
                ],
                AND: [
                    {
                        status: 1,
                    }
                ],
            },
        })
        
        let response: GetSpecialitysReturn = {
            data: records,
            totalRecords: totalRecords,
        }
        
        return response
    } catch (error) {
        console.log("getAccounts error", error)
        throw new Error("Error getting data")
    }
}

export const saveSpeciality = async (specialitysData: Speciality) => {
    try {

        console.log({specialitysData})

        const user = await getLoggedInUser(); //get logged Specialitys data


        const result = await prisma.speciality.create({
            data: {
                ...specialitysData,
                createdBy: user.id,
                createdAt: new Date()
            },
        })

        return result
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                throw new Error(
                    "Specialitys might exist from this phone or email address. please verify and try again"
                )
            }
        } else {
            throw new Error(error.message ?? "Save user Error")
        }
    }
}

export const updateOneSpeciality = async (id: string, payload: UpdateSpecialityDTO) => {
    try {

        const user = await getLoggedInUser(); //get logged user data

        await prisma.speciality.update({
            data: {
                ...payload,
                updatedBy: user.id,
                updatedAt: new Date()
            },
            where: {
                id: id,
            },
        })

        return true
    } catch (error: any) {
        console.log("updateOneSpeciality error ==> ", error)
        throw new Error(error.message ?? "Update user Error")
    }
}

export const getSpecialityById = async (id: string) => {
    try {
        const result = await prisma.speciality.findUnique({
            where: { id: id },
        })

        return result
    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
}

export const deleteSpecialitys = async (ids: string[]) => {
    try {
        await prisma.speciality.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        })

        return true
    } catch (error: any) {
        console.log("deleteSpeciality error ==> ", error)
        throw new Error(error.message ?? "Deleting Speciality Error")
    }
}

export const deleteOneSpeciality = async (id: string) => {
    try {
        await prisma.speciality.delete({
            where: {
                id: id,
            },
        })
        return true
    } catch (error: any) {
        console.log("deleteOneSpeciality error ==> ", error)
        throw new Error(error.message ?? "Delete Speciality Error")
    }
}

export const getAllSpecialitysForDocter = async () => {
    try {
        const data = await prisma.speciality.findMany({
            select :{
                id: true,name : true
            }
        })
        return data
    } catch (error: any) {
        console.log("deleteOneSpeciality error ==> ", error)
        throw new Error(error.message ?? "Delete speciality Error")
    }
}

export const getLastSpeciality = async () => {
    try {

        const lastSpeciality = await prisma.speciality.findFirst({
            orderBy: {
                code: 'desc',
            },
        });

        return lastSpeciality;
    } catch (error) {
        console.error("getLastSpeciality error:", error);
        return null;
    }
}