import { Component } from '@angular/core';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-imprint',
  imports: [TranslatePipe],
  templateUrl: './imprint.html',
  styleUrls: ['../legal.scss', './imprint.scss'],
})
export class Imprint {}
