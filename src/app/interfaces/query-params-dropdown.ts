export interface DropdownDisplayConfigInterface {
  label: string | null;
  key: string | null;
  defaultValue: string | null;
  emptyStateLabel?: string;
}

export interface DropdownFeaturesInterface {
  showCount?: boolean;
  enableSearch?: boolean;
  enableAllOption?: boolean;
}
