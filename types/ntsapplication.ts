//EXPORT ALL TYPES RELATED TO NTS APPLICATIONS FROM HERE

export type NtsApplication = {
    id?: string;
    title: string;
    full_name: string;
    date_of_birth: Date;
    age: number;
    gender: string;
    address1: string;
    address2: string | null;
    phone: string;
    nic: string;
    email: string;
    status: number;
    createdAt?: Date
    updatedAt?: Date
}

export type UpdateNtsApplicationDTO = Partial<NtsApplication>;

export type GetNtsApplicationParams = {
    page?: string
    limit?: string
    keyword?: string
    role: string
}

export type GetNtsApplicationQuery = {
    page: number
    limit: number
    keyword: string
}

export type GetNtsApplicationReturn = {
    data: NtsApplication[]
    totalRecords: number
}