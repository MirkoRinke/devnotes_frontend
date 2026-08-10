import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslatePipe } from '../../i18n/translate-pipe';
import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-home-button',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './home-button.html',
  styleUrl: './home-button.scss',
})
export class HomeButton {
  constructor(public svgIconsService: SvgIconsService) {}
}
