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

  ngOnDestroy() {
    console.log('PostMediaLinksEditor component destroyed');
  }

  public pushControlledValuesToArray() {
    this.images = this.imagesControl?.value ? [...this.imagesControl.value] : [];
    this.videos = this.videosControl?.value ? [...this.videosControl.value] : [];
    this.resources = this.resourcesControl?.value ? [...this.resourcesControl.value] : [];
  }

  public pushToControl() {
    console.log('pushToControl called in PostMediaLinksEditor');
    this.onClose();
  }

  public onClose() {
    this.closeModal.emit();
  }

  public changeType(type: 'images' | 'videos' | 'resources') {
    this.currentType = type;
    this.currentArray = this.getArrays(type);
  }

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

  public pushToArray(value: string, index: number | null = null) {
    value = value.trim();

    if (value === '' && index !== null) {
      this.removeFromArray(index);
      return;
    }

    if (index !== null && this.currentArray[index]) {
      this.currentArray[index] = value;
    } else {
      this.currentArray.unshift(value);
    }
    console.log('Current array after pushToArray:', this.currentArray);
  }

  public removeFromArray(index: number) {
    this.currentArray.splice(index, 1);
    console.log('removeFromArray' + this.currentType + ' called with index:', index);
  }
}
