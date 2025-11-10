import { contactColumns } from "@/app/(dashboard)/contact-inquiries/columns";
import { getLoggedInUser } from "@/lib/helpers/getLoggedInUser";
import prisma from "@/lib/prisma";
import {
  ContactInquiriesManager,
  GetContactInquiriesManagerQuery,
  GetContactInquiriesManagerReturn,
  UpdateContactInquiryDTO,
} from "@/types/contactinquiries";
import { Contact } from "lucide-react";

// Get all contact inquiries
export const getContactInquiries = async ({
  page,
  limit,
  keyword,
}: GetContactInquiriesManagerQuery) => {
  const skip = page * limit;

  try {
    const user = await getLoggedInUser(); //get logged user data

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

// Get single contact inquiry by ID
export const getContactInquiryById = async (id: string) => {
  try {
    const user = await getLoggedInUser(); //get logged user data

    const result = await prisma.career.update({
      data: {
        ...Contact,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
      where: {
        id: id,
      },
    });

    return {
      isError: false,
      error: "",
      data: result,
    };
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
    const user = await getLoggedInUser(); //get logged user data

    const result = await prisma.contactInquiries.update({
      data: {
        ...payload,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
      where: {
        id: id,
      },
    });

    return {
      isError: false,
      error: "",
      data: result,
    };
  } catch (error: any) {
    console.error("updateOneContactInquiry service error:", error);
    throw new Error(error.message || "Unable to update contact inquiry.");
  }
};

// ========== Delete one contact inquiry ==========
export const deleteOneContactInquiry = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/contactinquiries/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Failed to delete contact inquiry");

    return true;
  } catch (error: any) {
    console.error("deleteOneContactInquiry service error:", error);
    throw new Error(error.message || "Unable to delete contact inquiry.");
  }
};

// ========== Delete multiple contact inquiries ==========
export const deleteContactInquiries = async (
  ids: string[]
): Promise<boolean> => {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/contactinquiries/bulk-delete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      }
    );

    if (!res.ok) throw new Error("Failed to delete contact inquiries");

    return true;
  } catch (error: any) {
    console.error("deleteContactInquiries service error:", error);
    throw new Error(error.message || "Unable to delete contact inquiries.");
  }
};
