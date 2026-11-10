import { Component, inject } from '@angular/core';
import { AppSettingsService } from '../../../services/app.settings.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-imprint',
  imports: [TranslatePipe],
  templateUrl: './imprint.html',
  styleUrls: ['../legal.scss', './imprint.scss'],
})
export class Imprint {
  public readonly appSettingsService = inject(AppSettingsService);
  public readonly isFluid = this.appSettingsService.isFluid;
}
