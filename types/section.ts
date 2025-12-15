export type Section = {
    id?: string
    type: string
    layout: number
    order: number
    data: Record<string, any>;
    visibility: boolean
    pageId: string
}

export type UpdateSectionDTO = Partial<Section>;