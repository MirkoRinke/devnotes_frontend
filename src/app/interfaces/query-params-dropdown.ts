export interface DropdownDisplayConfigInterface {
  label: string | null;
  key: string | null;
  defaultValue: string | null;
  defaultValueLabel: string | null;
}

export interface DropdownFeaturesInterface {
  showCount?: boolean;
  enableSearch?: boolean;
  enableAllOption?: boolean;
}
