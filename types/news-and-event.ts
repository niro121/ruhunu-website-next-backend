import { boolean } from "yup"

export type NewsAndEvent = {
    id?: string
    name: string
    content: string
    image: string
    video: string | null
    facebook: string | null
    instagram: string | null
    twitter: string | null
    slug: string
    featured: boolean
    visibility: boolean
}

export type UpdateNewsAndEventDTO = Partial<NewsAndEvent>;

export type GetNewsAndEventParams = {
    page?: string
    limit?: string
    keyword?: string
}

export type GetNewsAndEventQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetNewsAndEventsReturn = {
    data: NewsAndEvent[]
    totalRecords: number
}