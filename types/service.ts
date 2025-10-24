export type Service = {
    id?: string
    name: string
    image: string
    content: string
    phone: string[]
    email: string[]
    slug: string
    featured: boolean
    visibility: boolean
}

export type UpdateServiceDTO = Partial<Service>;

export type GetServiceParams = {
    page?: string
    limit?: string
    keyword?: string
}

export type GetServiceQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetServiceReturn = {
    data: Service[]
    totalRecords: number
}