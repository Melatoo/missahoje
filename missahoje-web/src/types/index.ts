export interface PaginationMeta {
  itemCount: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
