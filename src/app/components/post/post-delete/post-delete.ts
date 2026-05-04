import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SvgIconsService } from '../../../services/svg.icons.service';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import type { PostInterface } from '../../../interfaces/post';

import type { PostParamsInterface } from '../../../interfaces/post-params';

@Component({
  selector: 'app-post-delete',
  imports: [],
  templateUrl: './post-delete.html',
  styleUrl: './post-delete.scss',
})
export class PostDelete {
  @Input() context: PostParamsInterface['context'] = null;
  @Input() endPoint: PostParamsInterface['endPoint'] = null;
  @Input() selectedEntity: PostParamsInterface['selectedEntity'] = null;
  @Input() selectedEntityValue: PostParamsInterface['selectedEntityValue'] = null;
  @Input() selectedPostType: PostParamsInterface['selectedPostType'] = null;

  @Input() post: PostInterface | null = null;

  @Output() closeModal = new EventEmitter<void>();

  constructor(
    public svgIconsService: SvgIconsService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    //For debugging purposes, log the input values to ensure they are being passed correctly
    console.log(this.context, this.endPoint, this.selectedEntity, this.selectedEntityValue, this.selectedPostType);
  }

  /**
   * Handle post deletion
   *
   * @param post
   * @returns
   */
  onDeletePost(post: PostInterface) {
    if (this.authService.getCurrentUserId() !== post.user_id) {
      console.error('User is not the owner of the post');
      return;
    }

    const url = `${ApiEndpointEnums.DELETE_POSTS}${post.id}`;

    const hasRequiredParams = !!(this.context && this.endPoint && this.selectedEntity && this.selectedEntityValue);

    this.apiService.delete(url).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        if (hasRequiredParams) {
          this.router.navigate(['/posts-list'], {
            queryParams: {
              context: this.context,
              endPoint: this.endPoint,
              selectedEntity: this.selectedEntity,
              selectedEntityValue: this.selectedEntityValue,
              selectedPostType: this.selectedPostType ?? null,
            },
            replaceUrl: true,
          });
        } else {
          this.router.navigate(['/']);
        }
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
