import { Component, Input, Output, EventEmitter, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { TranslationService } from '../../../i18n/translation.service';

import { BadgeMessageHandler } from '../../../utils/badge-message-handler';

import type { mediaLinksMessagesInterface } from '../../../interfaces/post-form';
import { badgeMessagesInit } from '../../../interfaces/validation-messages';
import { Badge } from '../../badge/badge';

@Component({
  selector: 'app-post-media-links-editor',
  imports: [ReactiveFormsModule, Badge],
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

  inputsContainer: ElementRef | null = null;
  isOverflowingY = false;

  @Output() closeModal = new EventEmitter<void>();

  messages: mediaLinksMessagesInterface = {
    mediaLinks: { ...badgeMessagesInit },
  };

  private msg = new BadgeMessageHandler<mediaLinksMessagesInterface>(this.messages, 'Post', inject(TranslationService), 3000);

  constructor(
    public svgIconsService: SvgIconsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.pushControlledValuesToArray();
    this.currentType = this.type;
    this.currentArray = this.getArrays(this.currentType);
  }

  @ViewChild('inputsContainer') set inputsContainerRef(content: ElementRef) {
    this.inputsContainer = content;
  }

  /**
   * Checks if the content of the inputs container is overflowing vertically (Y-axis) and updates the isOverflowingY property accordingly.
   * This method uses requestAnimationFrame to ensure that the check is performed after the DOM has been updated.
   */
  private checkIsOverflowingY(): void {
    requestAnimationFrame(() => {
      if (!this.inputsContainer) return;
      const el = this.inputsContainer.nativeElement;

      const isOverflowingY = el.scrollHeight > el.clientHeight;

      if (isOverflowingY !== this.isOverflowingY) {
        this.isOverflowingY = isOverflowingY;
        this.cdr.detectChanges();
      }
      console.log(this.isOverflowingY);
    });
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
    this.msg.clearMessage('mediaLinks');
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

    if (value.includes(' ')) {
      this.msg.setMessage('mediaLinks', 'error', 'INVALID_URL');
      return;
    }

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
      this.msg.setMessage('mediaLinks', 'info', 'DUPLICATE_URL');
      return;
    }

    if (index !== null && this.currentArray[index]) {
      this.currentArray[index] = value;
    } else {
      this.currentArray.unshift(value);
    }

    this.checkIsOverflowingY();
  }

  /**
   * Removes an item from the current array based on the provided index.
   *
   * @param index The index of the item to be removed from the current array.
   */
  public removeFromArray(index: number) {
    this.currentArray.splice(index, 1);
    this.checkIsOverflowingY();
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
      if (url.length > 2048) {
        this.msg.setMessage('mediaLinks', 'error', 'URL_TOO_LONG');
        return false;
      }

      const parsedURL = new URL(url);

      let hostname = parsedURL.hostname;

      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }

      let domainParts = hostname.split('.');

      if (domainParts.length === 1) {
        this.msg.setMessage('mediaLinks', 'error', 'MISSING_TLD');
        return false;
      }

      const hasTooLongLabel = domainParts.some((part) => part.length > 63);
      if (hasTooLongLabel) {
        this.msg.setMessage('mediaLinks', 'error', 'INVALID_URL');
        return false;
      }

      return parsedURL.protocol === 'http:' || parsedURL.protocol === 'https:';
    } catch (e) {
      this.msg.setMessage('mediaLinks', 'error', 'INVALID_URL');
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
