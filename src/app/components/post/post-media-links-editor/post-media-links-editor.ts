import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SvgIconsService } from '../../../services/svg.icons.service';

@Component({
  selector: 'app-post-media-links-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './post-media-links-editor.html',
  styleUrl: './post-media-links-editor.scss',
})
export class PostMediaLinksEditor {
  @Input() type: 'images' | 'videos' | 'resources' = 'images';
  @Input() imagesControl: FormControl | null = null;
  @Input() videosControl: FormControl | null = null;
  @Input() resourcesControl: FormControl | null = null;

  images: Array<string> = [];
  videos: Array<string> = [];
  resources: Array<string> = [];

  currentType: 'images' | 'videos' | 'resources' = 'images';
  currentArray: Array<string> = [];

  @Output() closeModal = new EventEmitter<void>();

  constructor(public svgIconsService: SvgIconsService) {}

  ngOnInit() {
    this.pushControlledValuesToArray();
    this.currentType = this.type;
    this.currentArray = this.getArrays(this.currentType);
  }

  /**
   * Pushes the current values from the FormControls (imagesControl, videosControl, resourcesControl)
   * to their respective arrays (images, videos, resources).
   */
  public pushControlledValuesToArray() {
    this.images = this.imagesControl?.value ? [...this.imagesControl.value] : [];
    this.videos = this.videosControl?.value ? [...this.videosControl.value] : [];
    this.resources = this.resourcesControl?.value ? [...this.resourcesControl.value] : [];
  }

  /**
   * Changes the current type of media being edited and updates the current array to reflect the selected type.
   *
   * @param type The type of media to switch to ('images', 'videos', or 'resources').
   */
  public changeType(type: 'images' | 'videos' | 'resources') {
    this.currentType = type;
    this.currentArray = this.getArrays(type);
  }

  /**
   * Returns the array corresponding to the provided type ('images', 'videos', or 'resources').
   *
   * @param type The type of media array to retrieve ('images', 'videos', or 'resources').
   * @returns The array corresponding to the provided type.
   */
  public getArrays(type: 'images' | 'videos' | 'resources') {
    switch (type) {
      case 'images':
        return this.images;
      case 'videos':
        return this.videos;
      case 'resources':
        return this.resources;
    }
  }

  /**
   * Adds a new value to the current array or updates an existing value based on the provided index.
   * If the value is empty and an index is provided, it removes the item from the array.
   *
   * @param value The value to be added or updated in the current array.
   * @param index The index of the item to be updated in the current array. If null, a new item is added.
   * @returns void
   */
  public pushToArray(value: string, index: number | null = null) {
    value = value.trim();

    if (value === '') {
      if (index !== null) {
        this.removeFromArray(index);
      }
      return;
    }

    value = this.normalizeAndEncodeURL(value);
    if (!this.isValidURL(value)) {
      return;
    }

    if (index === null && this.currentArray.includes(value)) {
      console.log('Value already exists in the current array:', value);
      return;
    }

    if (index !== null && this.currentArray[index]) {
      this.currentArray[index] = value;
    } else {
      this.currentArray.unshift(value);
    }
  }

  /**
   * Removes an item from the current array based on the provided index.
   *
   * @param index The index of the item to be removed from the current array.
   */
  public removeFromArray(index: number) {
    this.currentArray.splice(index, 1);
  }

  /**
   * Normalizes the provided URL by ensuring it starts with 'https://' and encodes it using encodeURI.
   *
   * @param url The URL to be normalized and encoded.
   * @returns The normalized and encoded URL.
   */
  private normalizeAndEncodeURL(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    if (url.startsWith('http://')) {
      url = 'https://' + url.substring(7);
    }
    return encodeURI(url);
  }

  /**
   * Validates whether the provided URL is a valid HTTP or HTTPS URL.
   *
   * @param url The URL to be validated.
   * @returns True if the URL is valid and uses the HTTP or HTTPS protocol, false otherwise.
   */
  private isValidURL(url: string): boolean {
    try {
      const parsedURL = new URL(url);

      let hostname = parsedURL.hostname;

      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }

      let domainParts = hostname.split('.');

      if (domainParts.length === 1) {
        return false;
      }

      return parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  /**
   * Pushes the current arrays of media links back to their respective FormControls and emits the closeModal event to close the modal.
   */
  public pushToControl() {
    if (this.imagesControl) {
      this.imagesControl.setValue(this.images);
    }
    if (this.videosControl) {
      this.videosControl.setValue(this.videos);
    }
    if (this.resourcesControl) {
      this.resourcesControl.setValue(this.resources);
    }

    this.onClose();
  }

  /**
   * Emits the closeModal event to signal that the modal should be closed.
   */
  public onClose() {
    this.closeModal.emit();
  }
}
