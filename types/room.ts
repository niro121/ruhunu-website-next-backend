export type Rooms = {
    id?: string
    name: string
    category: string
    image: string
    content: string
    slug: string
    order: number
    visibility: boolean
}

// when updating (partial, not includes id)
export type UpdateRoomDTO = Partial<Rooms>;

export type GetRoomsParams = {
    page?: string
    limit?: string
    keyword?: string
}

export type GetRoomsQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetRoomsReturn = {
    data: Rooms[]
    totalRecords: number
}