import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private readonly isFluidStorageKey = 'isFluid';

  private readonly _isFluid = signal<boolean>(this.loadInitialState(this.isFluidStorageKey, false));
  public readonly isFluid = this._isFluid.asReadonly();

  /**
   * Loads the initial boolean state for a given key from local storage.
   * Returns the fallback value if nothing is stored, the value is invalid or the storage is not accessible.
   *
   * @param key The local storage key to read.
   * @param fallback The value to use if no valid value could be loaded.
   * @returns The stored boolean value or the fallback.
   */
  private loadInitialState(key: string, fallback: boolean): boolean {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return fallback;

      const parsed: unknown = JSON.parse(saved);
      return typeof parsed === 'boolean' ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  /**
   * Toggles the fluid layout setting and updates local storage accordingly.
   */
  public toggleFluid(): 'success' | 'error' {
    const newValue = !this._isFluid();
    this._isFluid.set(newValue);

    try {
      localStorage.setItem(this.isFluidStorageKey, JSON.stringify(newValue));
      return 'success';
    } catch {
      this._isFluid.set(!newValue);
      return 'error';
    }
  }
}
