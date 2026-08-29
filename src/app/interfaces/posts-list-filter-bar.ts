import type { PostListParamsInterface } from './post-list-params';

export interface FilterValuesInterface {
  endPoint: PostListParamsInterface['endPoint'];
  selectedEntity: PostListParamsInterface['selectedEntity'];
  selectedEntityValue: PostListParamsInterface['selectedEntityValue'];
  selectedPostType: PostListParamsInterface['selectedPostType'];
  selectedCategory: PostListParamsInterface['category'];
  selectedStatus: PostListParamsInterface['status'];
  selectedDateFrom: PostListParamsInterface['dateFrom'];
  selectedDateTo: PostListParamsInterface['dateTo'];
  selectedSort: PostListParamsInterface['sort'];
  minDate: string | null;
  maxDate: string | null;
  entityValueParams: string[];
  postTypeParams: string[];
  categoryParams: string[];
}
