import type { PostParamsInterface } from './post-params';

export interface PostListParamsInterface extends PostParamsInterface {
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  status: string | null;
  sort: string | null;
  page: number;
  perPage: number;
  searchTerm: string | null;
}
