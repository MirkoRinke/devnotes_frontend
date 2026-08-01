import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-legal-acceptance',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './legal-acceptance.html',
  styleUrl: './legal-acceptance.scss',
})
export class LegalAcceptance {
  @Input() control: FormControl | null = null;

  @Output() acceptedConditionsChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onCheckboxChange(): void {
    const isChecked = this.control?.value;
    this.acceptedConditionsChange.emit(isChecked);
  }
}
