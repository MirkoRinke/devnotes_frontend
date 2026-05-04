import type { PostTypesParamsInterface } from './post-types-params';

export interface PostListParamsInterface extends PostTypesParamsInterface {
  postType: PostTypesParamsInterface['postType'];
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  status: string | null;
  sort: string | null;
  page: number;
  perPage: number;
  searchTerm: string | null;
}
