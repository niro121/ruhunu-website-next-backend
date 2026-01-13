export type Speciality = {
    id?: string
    name: string
    code: string
    description: string
    visibility: boolean
}

export type UpdateSpecialityDTO = Partial<Speciality>;

export type GetSpecialitysParams = {
    page?: string
    limit?: string
    keyword?: string
}

export type GetSpecialitysQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetSpecialitysReturn = {
    data: Speciality[]
    totalRecords: number
}