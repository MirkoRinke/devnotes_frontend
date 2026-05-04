import type { PostTypesParamsInterface } from './post-types-params';

export interface PostParamsInterface {
  context: PostTypesParamsInterface['context'];
  endPoint: PostTypesParamsInterface['endPoint'];
  selectedEntity: PostTypesParamsInterface['entity'];
  selectedEntityValue: PostTypesParamsInterface['entityValue'];
  selectedPostType: PostTypesParamsInterface['postType'];
}
