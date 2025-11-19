export type CenterLocation = {
  id?: string;
  centerName: string;
  address: string;
  phone: string;
};

export type Center = {
  id?: string;
  area: string;
  visibility: boolean;
  centers: CenterLocation[];
};

export type UpdateCenterDTO = Partial<Center>;

export type GetCentersParams = {
  page?: string;
  limit?: string;
  keyword?: string;
  visibility?: boolean;
};

export type GetCentersQuery = {
  page: number;
  limit: number;
  keyword: string;
  visibility?: boolean;
};

export type GetCentersReturn = {
  data: Center[];
  totalRecords: number;
};
