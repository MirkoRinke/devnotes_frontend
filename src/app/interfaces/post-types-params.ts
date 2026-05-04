import { ApiEndpointEnums } from '../enums/api-endpoint';
import { PostListAllowedEntitiesEnums } from '../enums/post-list-allowed-entities';
export interface PostTypesParamsInterface {
  context: string | null;
  endPoint: keyof typeof ApiEndpointEnums | null;
  entity: PostListAllowedEntitiesEnums | null;
  entityValue: string | null;
  postType?: string | null;
}
