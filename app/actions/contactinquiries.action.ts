"use server"

import {
  deleteContactInquiries,
  deleteOneContactInquiry,
  getContactInquiryById,
  getContactInquiries,
  updateOneContactInquiry,
} from "@/services/contactinquiries.service"
import {
  ContactInquiriesManager,
  GetContactInquiriesManagerParams,
  GetContactInquiriesManagerQuery,
} from "@/types/contactinquiries"
import { revalidatePath } from "next/cache"

// ========== Get all Contact Inquiries with pagination/search ==========
export const getAllContactInquiries = async (
  filter: GetContactInquiriesManagerParams
) => {
  try {
    const newFilter: GetContactInquiriesManagerQuery = {
      page: filter.page ? parseInt(filter.page) : 0,
      limit: filter.limit
        ? parseInt(filter.limit)
        : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
      keyword: filter.keyword ?? "",
    }

    // Call Service
    return await getContactInquiries(newFilter)
    
  } catch (error: any) {
    console.error("getAllContactInquiries error", error)
    throw new Error(
      error.message ?? "Error fetching contact inquiries. Please try again later."
    )
  }
}

// ========== Update a Contact Inquiry ==========
export const updateContactInquiry = async (
  id: string,
  payload: ContactInquiriesManager
) => {
  try {
    const updatedData = await updateOneContactInquiry(id, payload)
    return updatedData
  } catch (error: any) {
    console.error("updateContactInquiry error ==> ", error)
    return {
      isError: true,
      error: "Error updating contact inquiry",
      data: null,
    }
  }
}

// ========== Get a single Contact Inquiry by ID ==========
export const fetchContactInquiryById = async (id: string) => {
  try {
    if (!id) throw new Error("Contact inquiry ID not found")

    const inquiry = await getContactInquiryById(id)
    if (!inquiry) throw new Error("Contact inquiry not found")

    return inquiry
  } catch (error: any) {
    console.error("Error in fetchContactInquiryById:", error.message)
    throw new Error(error.message || "Unable to fetch contact inquiry.")
  }
}

// ========== Delete multiple Contact Inquiries ==========
export const bulkDeleteContactInquiries = async (ids: string[]) => {
  try {
    await deleteContactInquiries(ids)
    revalidatePath("/contactinquiries")
    return true
  } catch (error: any) {
    console.error("bulkDeleteContactInquiries error ==>", error)
    throw new Error(
      error.message ?? "Error deleting contact inquiries. Please try again later."
    )
  }
}

// ========== Delete a single Contact Inquiry ==========
export const deleteContactInquiry = async (id: string) => {
  try {
    await deleteOneContactInquiry(id)
    revalidatePath("/contactinquiries")
    return true
  } catch (error: any) {
    console.error("deleteContactInquiry error ==>", error)
    throw new Error(
      error.message ?? "Error deleting contact inquiry. Please try again later."
    )
  }
}
