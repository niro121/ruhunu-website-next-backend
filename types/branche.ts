export type Branche = {
    id?: string
    name: string
    image: string
    listImage: string[]
    description: string
    services: string
    phone: string[]
    latitude: string
    longitude: string
    slug: string
    visibility: boolean
}

export type UpdateBrancheDTO = Partial<Branche>;

export type GetBranchesParams = {
    page?: string
    limit?: string
    keyword?: string
    role: string
}

export type GetBranchesQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetBranchesReturn = {
    data: Branche[]
    totalRecords: number
}