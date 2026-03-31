import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import type { AvailableValuesInterface } from '../../../interfaces/available-values';

@Component({
  selector: 'app-post-tech-stack-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './post-tech-stack-selector.html',
  styleUrl: './post-tech-stack-selector.scss',
})
export class PostTechStackSelector {
  @Input() controlLanguages: FormControl | null = null;
  @Input() controlTechnologies: FormControl | null = null;

  availableValues: AvailableValuesInterface[] = [];

  constructor() {}

  ngOnInit() {
    console.log('controlLanguages', this.controlLanguages?.value);
    console.log('controlTechnologies', this.controlTechnologies?.value);
  }
}
