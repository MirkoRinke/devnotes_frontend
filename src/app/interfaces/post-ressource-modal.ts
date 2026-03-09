import { ExternalSourcePreviewInterface } from './post';

export interface PostResourceModalInterface {
  title: string;
  type: PostResourceType;
  resources: string[];
  previews: ExternalSourcePreviewInterface[];
}

export type PostResourceType = 'images' | 'videos' | 'resources' | null;
