import { Component } from '@angular/core';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-terms',
  imports: [TranslatePipe],
  templateUrl: './terms.html',
  styleUrls: ['../legal.scss', './terms.scss'],
})
export class Terms {}
