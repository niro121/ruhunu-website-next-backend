"use server";

import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import {
  ContactInquiriesManager,
  GetContactInquiriesManagerQuery,
  GetContactInquiriesManagerReturn,
  UpdateContactInquiryDTO,
} from "@/types/contactinquiries";

// ========== Get all contact inquiries ==========
export const getContactInquiries = async ({
  page,
  limit,
  keyword,
}: GetContactInquiriesManagerQuery) => {
  const skip = page * limit;

  try {
    const user = await getLoggedInUser(); // get logged user data

    const records = await prisma.contactInquiries.findMany({
      skip,
      take: limit,
      where: {
        OR: [{ name: { contains: keyword, mode: "insensitive" } }],
      },
      orderBy: { createdAt: "desc" },
    });

    const totalRecords = await prisma.contactInquiries.count({
      where: {
        OR: [{ name: { contains: keyword, mode: "insensitive" } }],
      },
    });

    const response: GetContactInquiriesManagerReturn = {
      data: records,
      totalRecords,
    };

    return response;
  } catch (error: any) {
    console.error("getContactInquiries service error:", error);
    throw new Error(error.message || "Unable to fetch contact inquiries.");
  }
};

// ========== Get single contact inquiry by ID ==========
export const getContactInquiryById = async (id: string) => {
  try {
    const result = await prisma.contactInquiries.findUnique({
      where: { id },
    });

    return result;
  } catch (error: any) {
    console.error("getContactInquiryById service error:", error);
    throw new Error(error.message || "Unable to fetch contact inquiry.");
  }
};

// ========== Update one contact inquiry ==========
export const updateOneContactInquiry = async (
  id: string,
  payload: UpdateContactInquiryDTO
) => {
  try {
    const user = await getLoggedInUser(); // get logged user data

    const result = await prisma.contactInquiries.update({
      data: {
        ...payload,
        updatedBy: user.id,
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
    console.error("updateOneContactInquiry service error:", error);
    return {
      isError: true,
      error: error.message || "Unable to update contact inquiry.",
      data: null,
    };
  }
};

// ========== Delete one contact inquiry ==========
export const deleteOneContactInquiry = async (id: string) => {
  try {
    await prisma.contactInquiries.delete({
      where: { id },
    });

    return true;
  } catch (error: any) {
    console.error("deleteOneContactInquiry service error:", error);
    throw new Error(error.message || "Unable to delete contact inquiry.");
  }
};

// ========== Delete multiple contact inquiries ==========
export const deleteContactInquiries = async (ids: string[]) => {
  try {
    await prisma.contactInquiries.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return true;
  } catch (error: any) {
    console.error("deleteContactInquiries service error:", error);
    throw new Error(error.message || "Unable to delete contact inquiries.");
  }
};
