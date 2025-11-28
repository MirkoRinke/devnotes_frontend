export interface UserProfileInterface {
  id: number;
  user_id?: number;
  display_name?: string;
  public_email?: string;
  website?: string;
  is_public?: boolean;
  location?: string;
  biography?: string;
  skills?: string[];
  social_links?: SocialLinksInterface;
  contact_channels?: ContactChannelsInterface;
  preferred_theme?: string;
  preferred_language?: string;
  auto_load_external_images?: boolean;
  external_images_temp_until?: string | null;
  auto_load_external_videos?: boolean;
  external_videos_temp_until?: string | null;
  auto_load_external_resources?: boolean;
  external_resources_temp_until?: string | null;
  reports_count?: number;
  created_at?: string;
  updated_at?: string;
  favorite_techs?: FavoriteTechsInterface[];
}

export interface FavoriteTechsInterface {
  id: number;
  name: string;
}

export interface ContactChannelsInterface {
  discord?: string;
}

export interface SocialLinksInterface {
  github?: string;
  linkedin?: string;
}
