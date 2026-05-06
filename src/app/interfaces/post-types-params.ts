import { ApiEndpointEnums } from '../enums/api-endpoint';
import { PageContextEnums } from '../enums/context';
import { PostListAllowedEntitiesEnums } from '../enums/post-list-allowed-entities';
export interface PostTypesParamsInterface {
  context: PageContextEnums | null;
  endPoint: keyof typeof ApiEndpointEnums | null;
  entity: PostListAllowedEntitiesEnums | null;
  entityValue: string | null;
  postType?: string | null;
}
