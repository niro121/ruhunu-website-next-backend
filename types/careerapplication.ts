export type CareerApplication = {
    id?: string
    careerId: string
    full_name: string
    email: string
    mobile_number: string
    resume: string
    status: number
}

export type UpdateCareerApplicationDTO = Partial<CareerApplication>;

export type GetCareerApplicationParams = {
    currentCareerId?: string;
    page?: string
    limit?: string
    keyword?: string
    visibility?: boolean
}

export type GetCareerApplicationQuery = {
    currentCareerId?: string;
    page: number
    limit: number
    keyword: string
    visibility?: boolean
}

export type GetCareerApplicationReturn = {
    data: CareerApplication[]
    totalRecords: number
}