import { Component, Input, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import { atLeastOne } from '../../../utils/custom-validators';

import { LocalDatePipe } from '../../../pipes/local-date-pipe';

import type { ApiResponseObjektInterface } from '../../../interfaces/api-response';
import type { PostInterface } from '../../../interfaces/post';
import type { PostPayload } from '../../../interfaces/post-payload';
import type { UserInterface } from '../../../interfaces/user';

import { QueryParamsDropdown } from '../../query-params-dropdown/query-params-dropdown';
import { UserBadge } from '../../user-badge/user-badge';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, LocalDatePipe, QueryParamsDropdown, UserBadge],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() post: PostInterface | null = null;

  @Output() modeChange = new EventEmitter<'view'>();
  @Output() resourceRefresh = new EventEmitter<PostInterface>();

  currentDate = new Date();

  postForm: FormGroup | null = null;

  currentUser: UserInterface | null = null;

  isProcessing = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createPostForm();
    console.log('PostForm:', this.postForm?.value);

    if (this.mode === 'create') {
      this.loadCurrentUser(this.getCurrentUserId());
    } else if (this.mode === 'edit' && this.post) {
      if (this.isOwner(this.post)) {
        this.patchPostForm();
        if (this.post.user) {
          this.currentUser = this.post.user;
        } else {
          this.loadCurrentUser(this.getCurrentUserId());
        }
      } else {
        console.warn('User is not the owner of the post. Switching to view mode.');
        this.switchMode('view');
      }
    }
  }

  /**
   * Fetches the current user data based on the user ID. If the user is not logged in or the user ID is null, it does nothing.
   *
   * @param userId  The ID of the user to fetch.
   */
  private loadCurrentUser(userId: number | null): void {
    if (!this.authService.isLoggedIn() || userId === null) {
      return;
    }

    const url = ApiEndpointEnums.USER + `${userId}`;

    this.apiService
      .get<ApiResponseObjektInterface<UserInterface>>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('User data fetched successfully:', response);
          this.currentUser = response.data.data;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }

  /**
   * Helper method to get the default value for a form control. If the control has a value, it returns that; otherwise, it returns the provided fallback value.
   *
   * @param controlName The name of the form control.
   * @param fallback The fallback value to return if the control has no value.
   * @returns The value of the form control or the fallback value.
   */
  public getDefaultValue(controlName: string, fallback: string): string {
    const value = this.postForm?.get(controlName)?.value;
    return value && typeof value === 'string' ? value : fallback;
  }

  /**
   * Creates the form group with all necessary controls and validators.
   *
   */
  private createPostForm(): void {
    this.postForm = this.fb.group(
      {
        // Required fields (Backend: required)
        title: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(255)] }),
        description: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
        category: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
        post_type: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
        status: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),

        // Optional fields (Backend: nullable)
        code: this.fb.control<string>('', { nonNullable: true }),

        images: this.fb.control<string[]>([], { nonNullable: true }),
        videos: this.fb.control<string[]>([], { nonNullable: true }),
        resources: this.fb.control<string[]>([], { nonNullable: true }),

        tags: this.fb.control<string[]>([], { nonNullable: true }),

        // Special case: Conditional required fields (required_without)
        languages: this.fb.control<string[]>([], { nonNullable: true }),
        technologies: this.fb.control<string[]>([], { nonNullable: true }),
      },
      {
        validators: [atLeastOne(['languages', 'technologies'], 'languageOrTechRequired')],
      },
    );
  }

  /**
   * Patches the form with the existing post data when in edit mode.
   */
  private patchPostForm(): void {
    if (this.post) {
      this.postForm?.patchValue({
        title: this.post.title ?? '',
        code: this.post.code ?? '',
        description: this.post.description ?? '',
        images: this.post.images ?? [],
        videos: this.post.videos ?? [],
        resources: this.post.resources ?? [],
        languages: this.post.languages ? this.post.languages.map((lang) => lang.name) : [],
        category: this.post.category ?? '',
        post_type: this.post.post_type ?? '',
        technologies: this.post.technologies ? this.post.technologies.map((tech) => tech.name) : [],
        tags: this.post.tags ? this.post.tags.map((tag) => tag.name) : [],
        status: this.post.status ?? '',
      });
    }
  }

  /**
   * Resets the form to its original values. In edit mode, it resets to the initial post data; in create mode, it clears the form.
   */
  public resetForm(): void {
    if (this.mode === 'edit' && this.post) {
      this.patchPostForm();
    } else {
      this.postForm?.reset();
    }
    this.postForm?.markAsPristine();
    this.postForm?.markAsUntouched();
    console.log('Form reset:', this.postForm?.value);
  }

  /**
   * Handles form submission. Validates the form and either creates a new post or updates an existing one based on the mode.
   *
   * @returns
   */
  public onSubmit(): void {
    if (!this.postForm) return;

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const formData: PostPayload = this.postForm.getRawValue();

    this.savePost(formData);
  }

  private savePost(data: PostPayload): PostInterface | void {
    console.log('Saving post with data:', data);
    /**
     * Prevent multiple save requests
     */
    if (this.isProcessing || !this.authService.isLoggedIn()) {
      return;
    }

    this.isProcessing = true;

    const url = ApiEndpointEnums.POSTS + (this.mode === 'edit' && this.post ? `${this.post.id}` : '');

    let method: 'patch' | 'post' = this.mode === 'edit' ? 'patch' : 'post';

    this.apiService[method]<ApiResponseObjektInterface<PostInterface>>(url, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Post saved successfully:', response.data.data);
          if (this.mode === 'edit') {
            this.switchMode('view');
            this.resourceRefresh.emit(response.data.data);
          } else {
            console.log('Post created successfully, navigating to post view with ID:', response.data.data.id);
            // this.router.navigate(['/post', response.data.data.id], {
            //   queryParams: {
            //     selectedEntity: 'placeholder', // TODO Pick the First-Choice Entity and Value based on the User Selection in the Language and Technology Modal
            //     selectedEntityValue: 'placeholder', // TODO Pick the First-Choice Entity and Value based on  User Selection in the Language and Technology Modal
            //   },
            //   queryParamsHandling: 'merge',
            //   replaceUrl: true,
            // });
          }

          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error saving post:', error);
          this.isProcessing = false;
        },
      });
  }

  /**
   * Check if the current user is the owner of the post
   *
   * @param post
   * @returns
   */
  private isOwner(post: PostInterface): boolean {
    return this.authService.isOwner(post.user_id ?? null);
  }

  /**
   * Get the current user ID from the AuthService
   *
   * @returns
   */
  private getCurrentUserId(): number | null {
    return this.authService.getCurrentUserId();
  }

  /**
   * Switches the mode of the form.
   *
   * @param newMode
   */
  public switchMode(newMode: 'view') {
    this.modeChange.emit(newMode);
  }

  /**
   * Generates the query parameters for fetching allowed values for dropdowns based on the type.
   *
   * @param type
   * @returns
   */
  public getAllowedValuesParams(type: string): string[] {
    let query = [`?filter[type]=${type}&select=count:name`];
    return query;
  }

  /**
   * Patches the form with the selected values from the dropdowns.
   *
   * @param values
   * @param type
   */
  public patchDropdownValues(values: string, type: string) {
    if (this.postForm) {
      this.postForm.patchValue({ [type]: values });
      this.postForm.get(type)?.markAsDirty();
      this.postForm.get(type)?.markAsTouched();
    }
  }
}

// Postman Example Payload:
// {
//   "title": "Laravel 11 & Angular: Clean Architecture",
//   "code": "public function store(PostRequest $request)\n{\n    $validated = $request->validated();\n    return Post::create($validated);\n}",
//   "description": "In diesem Beitrag schauen wir uns an, wie man eine saubere API-Struktur mit Laravel 11 aufbaut und diese effizient in eine Angular-Frontend-Architektur integriert. Fokus liegt auf Portabilität und DRY-Prinzipien.",
//   "images": [
//     "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
//     "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
//   ],
//   "videos": [
//     "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
//   ],
//   "resources": [
//     "https://laravel.com/docs/11.x",
//     "https://angular.io/guide/architecture"
//   ],
//   "languages": ["Laravel", "PHP", "JavaScript", "SCSS" ,"Pandas"],
//   "category": "Fullstack Development",
//   "post_type": "resources",
//   "technologies": ["Docker","Apache","MySQL"],
//   "tags": ["Clean Code", "Backend", "API", "Webdesign"],
//   "status": "published"
// }

// Laravel Validation Rules Example:
/**
 * The validation rules for the Create method
 *
 * @return array
 *
 * @example | $this->getValidationRulesCreate()
 */
// public function getValidationRulesCreate(): array {
//     $validationRulesCreate = [
//         'title' => 'required|string|max:255',
//         'code' => 'nullable|string',
//         'description' => 'required|string',
//         'images' => 'nullable|array',
//         'images.*' => ['max:2048', new SafeUrl()],
//         'videos' => 'nullable|array',
//         'videos.*' => ['max:2048', new SafeUrl()],
//         'resources' => 'nullable|array',
//         'resources.*' => ['max:2048', new SafeUrl()],
//         'languages' => 'required_without:technologies|array',
//         'languages.*' => ['required', new ValidPostValue('language')],
//         'category' => ['required', 'string', new ValidPostValue('category')],
//         'post_type' => ['required', 'string', new ValidPostValue('post_type')],
//         'technologies' => 'required_without:languages|array',
//         'technologies.*' => ['required', new ValidPostValue('technology')],
//         'tags' => 'nullable|array',
//         'tags.*' => ['string'],
//         'status' => ['required', 'string', new ValidPostValue('status')],
//     ];
//     return $validationRulesCreate;
// }

/**
 * The validation rules for the Update method
 *
 * @return array
 *
 * @example | $this->getValidationRulesUpdate()
 */
// public function getValidationRulesUpdate(): array {
//     $validationRulesUpdate = [
//         'title' => 'sometimes|required|string|max:255',
//         'code' => 'sometimes|nullable|string',
//         'description' => 'sometimes|required|string',
//         'images' => 'sometimes|nullable|array',
//         'images.*' => ['sometimes', 'max:2048', new SafeUrl()],
//         'videos' => 'sometimes|nullable|array',
//         'videos.*' => ['sometimes', 'max:2048', new SafeUrl()],
//         'resources' => 'sometimes|nullable|array',
//         'resources.*' => ['sometimes', 'max:2048', new SafeUrl()],
//         'languages' => 'sometimes|required_without:technologies|array',
//         'languages.*' => ['sometimes', 'required', new ValidPostValue('language')],
//         'category' => ['sometimes', 'required', 'string', new ValidPostValue('category')],
//         'post_type' => ['sometimes', 'required', 'string', new ValidPostValue('post_type')],
//         'technologies' => 'sometimes|required_without:languages|array',
//         'technologies.*' => ['sometimes', 'required', new ValidPostValue('technology')],
//         'tags' => 'sometimes|array',
//         'tags.*' => ['sometimes', 'string'],
//         'status' => ['sometimes', 'required', 'string', new ValidPostValue('status')],
//     ];
//     return $validationRulesUpdate;
// }
