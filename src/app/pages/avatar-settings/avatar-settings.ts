import { Component } from '@angular/core';
import { UserAvatarCustomizer } from '../../components/user-avatar-customizer/user-avatar-customizer';

@Component({
  selector: 'app-avatar-settings',
  imports: [UserAvatarCustomizer],
  templateUrl: './avatar-settings.html',
  styleUrl: './avatar-settings.scss',
})
export class AvatarSettings {}
