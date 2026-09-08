export interface DropdownDisplayConfigInterface {
  label: string | null;
  key: string | null;
  currentValue: string | null;
  emptyStateLabel?: string;
}

export interface DropdownFeaturesInterface {
  showCount?: boolean;
  enableSearch?: boolean;
  enableAllOption?: boolean;
}
