import { Component } from '@angular/core';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-privacy',
  imports: [TranslatePipe],
  templateUrl: './privacy.html',
  styleUrls: ['../legal.scss', './privacy.scss'],
})
export class Privacy {}
