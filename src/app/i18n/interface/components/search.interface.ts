export interface SearchMessagesInterface {
  search: string;
  filter: string;
  escapeHint: string;
  ariaLabel: {
    startSearch: string;
    closeSearch: string;
  };
}
