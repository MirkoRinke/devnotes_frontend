import { ExternalSourcePreviewInterface } from './post';

export interface PostResourceModalInterface {
  title: string;
  resources: string[];
  previews: ExternalSourcePreviewInterface[];
}
