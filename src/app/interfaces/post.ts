import type { UserInterface } from './user.ts';
import type { LanguagesInterface } from './languages';
import type { TechnologiesInterface } from './technologies';
import type { TagsInterface } from './tags';

export interface PostInterface {
  id: number;
  user_id?: number;
  title?: string;
  code?: string;
  description?: string;
  images?: string[];
  videos?: string[];
  resources?: string[];
  external_source_previews?: Array<ExternalSourcePreviewInterface>;
  category?: string;
  post_type?: string;
  status?: string;
  syntax_highlighting?: string;
  favorite_count?: number;
  likes_count?: number;
  reports_count?: number;
  comments_count?: number;
  is_updated?: boolean;
  updated_by_role?: string | null;
  comments_updated_at?: string;
  history?: any[];
  moderation_info?: any[];
  created_at?: string;
  updated_at?: string;
  is_favorited?: boolean;
  is_liked?: boolean;
  is_read?: boolean;
  tags?: Array<TagsInterface>;
  languages?: Array<LanguagesInterface>;
  technologies?: Array<TechnologiesInterface>;
  user?: UserInterface;
}

export interface ExternalSourcePreviewInterface {
  url: string;
  type: string;
  domain: string;
}
