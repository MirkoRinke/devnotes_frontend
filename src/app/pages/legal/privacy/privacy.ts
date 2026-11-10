import { Component, inject } from '@angular/core';
import { AppSettingsService } from '../../../services/app.settings.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-privacy',
  imports: [TranslatePipe],
  templateUrl: './privacy.html',
  styleUrls: ['../legal.scss', './privacy.scss'],
})
export class Privacy {
  public readonly appSettingsService = inject(AppSettingsService);
  public readonly isFluid = this.appSettingsService.isFluid;
}
