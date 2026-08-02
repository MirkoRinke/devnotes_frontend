import { Component, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-avatar-layer',
  imports: [],
  templateUrl: './avatar-layer.html',
  styleUrl: './avatar-layer.scss',
})
export class AvatarLayer {
  @Input() avatarMvpId: number | null = null;
  @Input() menuOpen: boolean = false;
  @Input() direction: 'right' | 'left' = 'right';

  adminAvatarID: number = 1000;
  moderatorAvatarID: number = 1001;
  systemAvatarID: number = 1002;

  avatarMvpPath: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['avatarMvpId']) {
      this.mvpAvatarPath();
    }
  }

  /**
   * Get the path for the user's MVP avatar
   *
   * @param user
   */
  mvpAvatarPath(): void {
    const avatarMvpId = this.validAvatarID();
    this.avatarMvpPath = `/avatar-mvp/mvp_${avatarMvpId}.webp`;
  }

  /**
   * Checks if the provided avatar ID is valid based on the defined standard and system avatar IDs.
   *
   * @returns The valid avatar ID, which is either the provided avatar ID if valid, or 1 if invalid.
   */
  validAvatarID(): number {
    const avatarMvpId = this.avatarMvpId ?? 1;
    const isStandard = avatarMvpId && avatarMvpId >= 1 && avatarMvpId <= 20;
    const isSystem = avatarMvpId && (avatarMvpId === this.adminAvatarID || avatarMvpId === this.moderatorAvatarID || avatarMvpId === this.systemAvatarID);

    if (isStandard || isSystem) {
      return avatarMvpId;
    } else {
      return 1;
    }
  }
}
