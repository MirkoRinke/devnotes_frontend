import { Component, inject } from '@angular/core';
import { AppSettingsService } from '../../../services/app.settings.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-terms',
  imports: [TranslatePipe],
  templateUrl: './terms.html',
  styleUrls: ['../legal.scss', './terms.scss'],
})
export class Terms {
  public readonly appSettingsService = inject(AppSettingsService);
  public readonly isFluid = this.appSettingsService.isFluid;
}
