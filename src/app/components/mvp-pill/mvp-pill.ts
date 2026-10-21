import { Component } from '@angular/core';

import { TranslatePipe } from '../../i18n/translate-pipe';

@Component({
  selector: 'app-mvp-pill',
  imports: [TranslatePipe],
  templateUrl: './mvp-pill.html',
  styleUrl: './mvp-pill.scss',
})
export class MvpPill {}
