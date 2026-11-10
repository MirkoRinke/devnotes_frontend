import { Component, inject } from '@angular/core';
import { PostForm } from '../../components/post/post-form/post-form';
import { AppSettingsService } from '../../services/app.settings.service';

@Component({
  selector: 'app-post-create',
  imports: [PostForm],
  templateUrl: './post-create.html',
  styleUrl: './post-create.scss',
})
export class PostCreate {
  public readonly appSettingsService = inject(AppSettingsService);
  public readonly isFluid = this.appSettingsService.isFluid;
}
