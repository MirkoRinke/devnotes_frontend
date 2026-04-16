import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SvgIconsService } from '../../../services/svg.icons.service';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

@Component({
  selector: 'app-post-delete',
  imports: [],
  templateUrl: './post-delete.html',
  styleUrl: './post-delete.scss',
})
export class PostDelete {
  @Input() postId: number | null = null;
  @Input() postUserId: number | null = null;
  @Input() postTitle: string | null = null;

  @Output() closeModal = new EventEmitter<void>();

  constructor(
    public svgIconsService: SvgIconsService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Handle post deletion
   *
   * @param postId
   * @param postUserId
   * @returns
   */
  onDeletePost(postId: number, postUserId: number) {
    if (this.authService.getCurrentUserId() !== postUserId) {
      console.error('User is not the owner of the post');
      return;
    }

    const url = `${ApiEndpointEnums.DELETE_POSTS}${postId}`;

    this.apiService.delete(url).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        //TODO Navigate to the Post List or Home page after deletion
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error deleting post:', error);
      },
    });
  }

  /**
   * Close the delete confirmation modal
   */
  public onClose() {
    this.closeModal.emit();
  }
}
