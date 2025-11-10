// EXPORT ALL TYPES RELATED TO CONTACT FROM HERE

export type ContactInquiriesManager = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: boolean;
};

export type UpdateContactInquiryDTO = Partial<ContactInquiriesManager>;

export type GetContactInquiriesManagerParams = {
  page?: string;
  limit?: string;
  keyword?: string;
//   role?: string;
};

export type GetContactInquiriesManagerQuery = {
  page: number;
  limit: number;
  keyword: string;
//   role?: string;
};

export type GetContactInquiriesManagerReturn = {
  data: ContactInquiriesManager[];
  totalRecords: number;
};
