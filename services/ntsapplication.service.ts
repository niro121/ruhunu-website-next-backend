"use server";

import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import {
  NtsApplicationManager,
  GetNtsApplicationManagerQuery,
  GetNtsApplicationManagerReturn,
  NtsApplicationManagerPartial,
} from "@/types/ntsapplication-manager";

// Get all applications with pagination /search
export const getApplications = async ({
  page,
  limit,
  keyword,
}: GetNtsApplicationManagerQuery) => {
  const skip = page * limit;

  try {
    const user = await getLoggedInUser(); // get logged user data

    const records = await prisma.ntsApplication.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          { full_name: { contains: keyword, mode: "insensitive" } },
          { nic: { contains: keyword, mode: "insensitive" } },
          { email: { contains: keyword, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRecords = await prisma.ntsApplication.count({
      where: {
        OR: [
          { full_name: { contains: keyword, mode: "insensitive" } },
          { nic: { contains: keyword, mode: "insensitive" } },
          { email: { contains: keyword, mode: "insensitive" } },
        ],
      },
    });

    const response: GetNtsApplicationManagerReturn = {
      data: records,
      totalRecords,
    };

    return response;
  } catch (error) {
    console.error("getApplications error", error);
    throw new Error("Error getting applications data");
  }
};

// Create new application
export const saveApplication = async (application: NtsApplicationManager) => {
  try {
    const user = await getLoggedInUser(); // get logged user data

    const result = await prisma.ntsApplication.create({
      data: {
        ...application,
        status: application.status ?? 1,
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
      if (error.code === "P2002") {
        return {
          isError: true,
          error: "Application with same data already exists",
          data: null,
        };
      }
    }

    return {
      isError: true,
      error: error.message ?? "Error saving application",
      data: null,
    };
  }
};

// Update application
export const updateOneApplication = async (id: string, payload: NtsApplicationManagerPartial) => {
  console.log ({payload})
  try {
    const user = await getLoggedInUser();

    const result = await prisma.ntsApplication.update({
      data: {
        ...payload,
        // updatedBy: user.id,
        updatedAt: new Date(),
      },
      where: {
        id,
      },
    });

    return {
      isError: false,
      error: "",
      data: result,
    };
  } catch (error: any) {
    console.log("updateOneApplication error ==> ", error);

    return {
      isError: true,
      error: "Update Application Error",
      data: null,
    };
  }
};

// Get single application by ID
export const getApplicationById = async (id: string) => {
  try {
    const result = await prisma.ntsApplication.findUnique({
      where: { id },
    });

    return result;
  } catch (error: any) {
    throw new Error(error.message ?? "");
  }
};

// Delete bulk applications
export const deleteApplications = async (ids: string[]) => {
  try {
    await prisma.ntsApplication.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return true;
  } catch (error: any) {
    console.log("deleteApplications error ==> ", error);
    throw new Error(error.message ?? "Deleting Applications Error");
  }
};

// Delete single application 
export const deleteOneApplication = async (id: string) => {
  try {
    await prisma.ntsApplication.delete({
      where: { id },
    });
    return true;
  } catch (error: any) {
    console.log("deleteOneApplication error ==> ", error);
    throw new Error(error.message ?? "Delete Application Error");
  }
};
