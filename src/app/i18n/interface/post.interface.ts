export interface PostMessagesInterface {
  error: PostErrorMessages;
  info: PostInfoMessages;
  success: PostSuccessMessages;
}

// #region Error Messages
interface PostErrorMessages {
  delete: DeleteErrorActions;
  post_type: PostFieldErrors;
  category: PostFieldErrors;
  syntax_highlighting: PostFieldErrors;
  status: PostFieldErrors;
  title: PostFieldErrors;
  description: PostFieldErrors;
  code: PostFieldErrors;
  language_or_tech_required: PostFieldErrors;
  mediaLinks: MediaLinksErrorActions;
  tags: PostErrorActions;
}
interface BaseError {
  UNKNOWN_ERROR: string;
}

interface DeleteErrorActions extends BaseError {
  NO_PERMISSION: string;
  CONFIRMATION_TEXT_MISMATCH: string;
}

interface PostFieldErrors {
  E: string;
}

interface MediaLinksErrorActions {
  INVALID_URL: string;
  URL_TOO_LONG: string;
  MISSING_TLD: string;
}

interface PostErrorActions {
  TAG_TOO_LONG: string;
}

// #endregion

// #region Info Messages
interface PostInfoMessages {
  delete: DeleteInfoActions;
  syntax_highlighting: SyntaxInfoActions;
  mediaLinks: MediaLinksInfoActions;
  tags: TagsInfoActions;
}

interface DeleteInfoActions {
  CONFIRMATION_TEXT_REQUIRED: string;
}

interface SyntaxInfoActions {
  syntax_highlighting_required: string;
}

interface MediaLinksInfoActions {
  DUPLICATE_URL: string;
}

interface TagsInfoActions {
  TAG_ADDED: string;
  TAG_ALREADY_SELECTED: string;
}

// #endregion

// #region Success Messages
interface PostSuccessMessages {
  delete: DeleteSuccessActions;
}

interface DeleteSuccessActions {
  DELETE_SUCCESS: string;
}
// #endregion
