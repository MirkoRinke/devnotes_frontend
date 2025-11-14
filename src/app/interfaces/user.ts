export interface UserInterface {
  id: number;
  name?: string;
  email_verified_at?: string;
  email?: string;
  github_id?: string | null;
  display_name?: string;
  role?: string;
  avatar_items?: {
    duck?: string | null;
    background?: string | null;
    ear_accessory?: string | null;
    eye_accessory?: string | null;
    head_accessory?: string | null;
    neck_accessory?: string | null;
    chest_accessory?: string | null;
  };
  is_banned?: boolean | null;
  was_ever_banned?: boolean;
  moderation_info?: any[];
  privacy_policy_accepted_at?: string;
  terms_of_service_accepted_at?: string;
  created_at?: string;
  updated_at?: string;
  last_post_created_at?: string;
  last_post_updated_at?: string | null;
}
