export interface PostListParamsInterface {
  entityValue: string | null;
  entity: string;
  postType: string | null;
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  sort: string | null;
  page: number;
  perPage: number;
}
