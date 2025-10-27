export type NewsLetter = {
    id?: string
    email: string
}

export type UpdateNewsLetterDTO = Partial<NewsLetter>;

export type GetNewsLettersParams = {
    page?: string
    limit?: string
    keyword?: string
}

export type GetNewsLettersQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetNewsLettersReturn = {
    data: NewsLetter[]
    totalRecords: number
}