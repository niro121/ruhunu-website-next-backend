// EXPORT ALL TYPES RELATED TO DOCTERS FROM HERE

export type Docter = {
    id?: string
    title: string
    name: string
    speciality: string
    branch: string[]
    image: string
    code: string
    order: number
    phone: string
    mobile: string
    address1: string
    address2: string
    city: string
    regNumber: string
    qualification: string
    referralCharge: number
    sessionNoPrefix: string
    featured: boolean
    laboratory: boolean
    visibility: boolean
    advanceBooking: boolean
    createdAt?: Date
    updatedAt?: Date
}

export type UpdateDocterDTO = Partial<Docter>;

export type GetDoctersParams = {
    page?: string
    limit?: string
    keyword?: string
    role: string
}

export type GetDoctersQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetDoctersReturn = {
    data: Docter[]
    totalRecords: number
}