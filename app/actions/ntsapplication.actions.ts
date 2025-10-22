"use server";

import {
  deleteApplications,
  deleteOneApplication,
  getApplicationById,
  getApplications,
  saveApplication,
  updateOneApplication,
} from "@/services/ntsapplication.service";

import {
  NtsApplicationManager,
  GetNtsApplicationManagerParams,
  GetNtsApplicationManagerQuery,
  NtsApplicationManagerPartial,
} from "@/types/ntsapplication-manager";

import { revalidatePath } from "next/cache";

// ========== Get all Applications with pagination/search ==========
export const getAllApplications = async (filter: GetNtsApplicationManagerParams) => {
  try {
    const newFilter: GetNtsApplicationManagerQuery = {
      page: filter.page ? parseInt(filter.page) : 0,
      limit: filter.limit ? parseInt(filter.limit) : parseInt(process.env.DEFAULT_PER_PAGE ?? "0"),
      keyword: filter.keyword ?? "",
    };

    // Call Service
    return await getApplications(newFilter);
  } catch (error: any) {
    console.error("getAllApplications error", error);
    throw new Error(error.message ?? "Error getting data. Please try again later.");
  }
};

// ========== Create Application ==========
export const createNewApplication = async (payload: NtsApplicationManager) => {
  try {
    // required validations
    if (!payload.full_name) {
      throw new Error("Full Name is required");
    }

    delete (payload as any).id;
    delete (payload as any).createdAt;
    delete (payload as any).updatedAt;

    // Default values
    if (payload.status === undefined) payload.status = 1;

    // Call Service
    const savedData = await saveApplication(payload);

    revalidatePath("/ntsapplication");

    return savedData;
  } catch (error: any) {
    console.error("createNewApplication error ==>", error);
    return {
      isError: true,
      errors: { message: error.message ?? "Something went wrong. Please try again later." },
      data: null,
    };
  }
};

// ========== Update Application ==========
export const updateApplication = async (id: string, payload: NtsApplicationManagerPartial) => {
  try {
    const updatedData = await updateOneApplication(id, payload);
    return updatedData;
  } catch (error: any) {
    console.log("updateApplication error ==> ", error);
    return {
      isError: true,
      error: "Update Application Error",
      data: null,
    };
  }
};

// ========== Get single Application by ID ==========
export const fetchApplicationById = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Application ID not found");
    }

    const application = await getApplicationById(id);

    if (!application) {
      throw new Error("Application not found");
    }

    return application;
  } catch (error: any) {
    console.error("Error in fetchApplicationById:", error.message);
    throw new Error(error.message || "Unable to fetch Application.");
  }
};

// ========== Delete bulk Applications ==========
export const bulkDeleteApplications = async (ids: string[]) => {
  try {
    await deleteApplications(ids);
    revalidatePath("/ntsapplication");
    return true;
  } catch (error: any) {
    console.log("bulkDeleteApplications error ==>", error);
    throw new Error(error.message ?? "Error deleting records. Please try again later.");
  }
};

// ========== Delete single Application ==========
export const deleteApplication = async (id: string) => {
  try {
    await deleteOneApplication(id);
    revalidatePath("/ntsapplication");
    return true;
  } catch (error: any) {
    console.log("deleteApplication error ==>", error);
    throw new Error(error.message ?? "Error deleting data. Please try again later.");
  }
};
