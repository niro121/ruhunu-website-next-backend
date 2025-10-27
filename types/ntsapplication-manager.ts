// EXPORT ALL TYPES RELATED TO DOCTORS FROM HERE

export type NtsApplicationManager = {
  id?: string;
  title: string;
  full_name: string;
  date_of_birth: Date;
  age: number;
  gender: string;
  address1: string;
  address2?: string | null;
  phone: string;
  nic: string;
  status: number;
  email: string;
};

export type NtsApplicationManagerPartial = Partial<NtsApplicationManager>;

export type GetNtsApplicationManagerParams = {
  page?: string;
  limit?: string;
  keyword?: string;
//   role?: string;
};

export type GetNtsApplicationManagerQuery = {
  page: number;
  limit: number;
  keyword: string;
//   role?: string;
};

export type GetNtsApplicationManagerReturn = {
  data: NtsApplicationManager[];
  totalRecords: number;
};
