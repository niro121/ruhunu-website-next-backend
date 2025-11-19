export type RoomsCategory = {
    id?: string
    name: string
    visibility: boolean
}

// when updating (partial, not includes id)
export type UpdateRoomsCategoryDTO = Partial<RoomsCategory>;

export type GetRoomsCategoryParams = {
    page?: string
    limit?: string
    keyword?: string
}

export type GetRoomsCategoryQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetRoomsCategoryReturn = {
    data: RoomsCategory[]
    totalRecords: number
}