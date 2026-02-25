export interface PostListParamsInterface {
  context: string | null;
  endPoint: string | null;
  entity: string;
  entityValue: string | null;
  postType: string | null;
  category: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  sort: string | null;
  page: number;
  perPage: number;
  searchTerm: string | null;
}
