import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-avatar-layer',
  imports: [],
  templateUrl: './avatar-layer.html',
  styleUrl: './avatar-layer.scss',
})
export class AvatarLayer implements OnChanges {
  @Input() avatarMvpId: number | null | 'guest' = null;
  @Input() menuOpen: boolean = false;
  @Input() direction: 'right' | 'left' = 'right';

  private readonly adminAvatarID: number = 1000;
  private readonly moderatorAvatarID: number = 1001;
  private readonly systemAvatarID: number = 1002;

  public avatarMvpPath: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['avatarMvpId']) {
      this.mvpAvatarPath();
    }
  }

  /**
   * Sets the path for the user's MVP avatar based on the valid avatar ID.
   */
  private mvpAvatarPath(): void {
    const avatarMvpId = this.validAvatarID();
    this.avatarMvpPath = `/avatar-mvp/mvp_${avatarMvpId}.webp`;
  }

  /**
   * Checks if the provided avatar ID is valid based on the defined standard and system avatar IDs.
   *
   * @returns The valid avatar ID, which is either the provided avatar ID if valid, or 1 if invalid.
   */
  private validAvatarID(): number | 'guest' {
    if (this.avatarMvpId === 'guest') {
      return 'guest';
    }

    const avatarMvpId = this.avatarMvpId ?? 1;
    const isStandard = avatarMvpId >= 1 && avatarMvpId <= 20;
    const isSystem = [this.adminAvatarID, this.moderatorAvatarID, this.systemAvatarID].includes(avatarMvpId);

    return isStandard || isSystem ? avatarMvpId : 1;
  }
}
