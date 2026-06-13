import { Component } from '@angular/core';
import { ActionPlaceholder } from '../../components/action-placeholder/action-placeholder';

@Component({
  selector: 'app-goodbye',
  imports: [ActionPlaceholder],
  templateUrl: './goodbye.html',
  styleUrl: './goodbye.scss',
})
export class Goodbye {}
