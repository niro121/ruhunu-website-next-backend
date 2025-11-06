export type Page = {
    id?: string
    title: string
    metaTitle: string
    metaKeyword: string
    metaDescription: string
    metaImage: string
    slug: string
    visibility: boolean 
}

export type UpdatePageDTO = Partial<Page>;

export type GetPagesParams = {
    page?: string
    limit?: string
    keyword?: string
    role: string
}

export type GetPagesQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetPagesReturn = {
    data: Page[]
    totalRecords: number
}