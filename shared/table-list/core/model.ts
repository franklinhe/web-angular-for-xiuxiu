export class Param {
  search?: string | number;
  pageNum: number;
  pageSize: number | string;
  sortName?: string;
  sortOrder?: string;
  [propName: string]: any
}
export class Config {
  // Select the first item by default
  isActiveFist?: boolean;
  // Initialize loading data
  initList?: true;
  // Total Background Data
  total?: number;
  [propName: string]: any
}
