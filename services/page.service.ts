import { GetPagesQuery, Page, UpdatePageDTO } from "@/types/page"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

// ========== Get all pages with pagination/search ==========
export const getPages = async ({
    page,
    limit,
    keyword,
}: GetPagesQuery) => {
    const skip = page * limit

    try {

    } catch (error) {
        console.error("getPages error", error)
        throw new Error("Error getting Pages data")
    }
}

// ========== Create Page ==========
export const savePage = async (page: Page) => {

    try {

    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
    
            if (error.code === "P2002") {
    
                return {
                    isError: true,
                    error: "Room with same slug already exists",
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

// ========== Update Page ==========
export const updateOnePage = async (id: string, payload: UpdatePageDTO) => {
    try {

    } catch (error: any) {
        console.log("updateOnePage error ==> ", error)

        return {
            isError: false,
            error: "Update Page Error",
            data: null
        }
    }
}

// ========== Get single Page data ==========
export const getPageById = async (id: string) => {

    try {

    } catch (error: any) {
        throw new Error(error.message ?? "")
    }
};

// ========== Delete bulk Pages ==========
export const deletePages = async (ids: string[]) => {

    try {
        
    } catch (error: any) {
        console.log("deletePages error ==> ", error)
        throw new Error(error.message ?? "Deleting Pages Error")
    }
}

// ========== Delete single Page ==========
export const deleteOnePage = async (id: string) => {
    try {
        
    } catch (error: any) {
        console.log("deleteOnePage error ==> ", error)
        throw new Error(error.message ?? "Delete Page Error")
    }
}
