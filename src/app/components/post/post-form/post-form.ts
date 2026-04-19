import { Component, Input, Output, EventEmitter, inject, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { SvgIconsService } from '../../../services/svg.icons.service';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import { atLeastOne, requiredWith } from '../../../utils/custom-validators';

import { LocalDatePipe } from '../../../pipes/local-date-pipe';

import type { ApiResponseObjektInterface } from '../../../interfaces/api-response';
import type { PostInterface } from '../../../interfaces/post';
import type { PostPayload } from '../../../interfaces/post-payload';
import type { UserInterface } from '../../../interfaces/user';
import type { TagsInterface } from '../../../interfaces/tags';
import type { TechStackSelectedValueInterface, resourceRefreshInterface } from '../../../interfaces/postForm';
import type { ExternalSourceInterface } from '../../../interfaces/post-external-source';

import { QueryParamsDropdown } from '../../query-params-dropdown/query-params-dropdown';
import { UserBadge } from '../../user-badge/user-badge';
import { PostEngagement } from '../post-engagement/post-engagement';
import { PostCode } from '../post-code/post-code';
import { PostDescription } from '../post-description/post-description';
import { PostTechStack } from '../post-tech-stack/post-tech-stack';
import { PostTechStackSelector } from '../post-tech-stack-selector/post-tech-stack-selector';
import { PostMediaLinks } from '../post-media-links/post-media-links';
import { PostTags } from '../post-tags/post-tags';
import { PostMediaLinksEditor } from '../post-media-links-editor/post-media-links-editor';
import { PostTagsEditor } from '../post-tags-editor/post-tags-editor';

@Component({
  selector: 'app-post-form',
  imports: [
    ReactiveFormsModule,
    LocalDatePipe,
    QueryParamsDropdown,
    UserBadge,
    PostEngagement,
    PostCode,
    PostDescription,
    PostTechStack,
    PostTechStackSelector,
    PostMediaLinks,
    PostTags,
    PostMediaLinksEditor,
    PostTagsEditor,
  ],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() post: PostInterface | null = null;

  @Output() modeChange = new EventEmitter<'view'>();
  @Output() resourceRefresh = new EventEmitter<resourceRefreshInterface>();

  currentDate = new Date();

  postForm: FormGroup | null = null;
  postFormCode: string | null = null;

  necessaryUserFields: string = 'display_name,avatar_items';
  currentUser: UserInterface | null = null;

  isTechStackSelectorModalOpen = false;
  isTechStackSelectorModalAnimating = false;

  isMediaLinksEditorModalOpen = false;
  isMediaLinksEditorModalAnimating = false;
  mediaLinksEditorType: 'images' | 'videos' | 'resources' = 'images';

  isTagsModalOpen = false;
  isTagsModalAnimating = false;

  isProcessing = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    public svgIconsService: SvgIconsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.createPostForm();
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

    const options = {
      params: new HttpParams().set('select', this.necessaryUserFields),
    };

    const url = ApiEndpointEnums.USER + `${userId}` + '?' + options.params.toString();

    this.apiService
      .get<ApiResponseObjektInterface<UserInterface>>(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
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
        syntax_highlighting: this.fb.control<string>('', { nonNullable: true }),

        // Optional fields (Backend: nullable)
        code: this.fb.control<string>('', { nonNullable: true }),

        images: this.fb.control<string[]>([], { nonNullable: true }),
        videos: this.fb.control<string[]>([], { nonNullable: true }),
        resources: this.fb.control<string[]>([], { nonNullable: true }),

        tags: this.fb.control<Array<TagsInterface>>([], { nonNullable: true }),

        // Special case: Conditional required fields (required_without)
        languages: this.fb.control<Array<TechStackSelectedValueInterface>>([], { nonNullable: true }),
        technologies: this.fb.control<Array<TechStackSelectedValueInterface>>([], { nonNullable: true }),
      },
      {
        validators: [atLeastOne(['languages', 'technologies'], 'languageOrTechRequired'), requiredWith('languages', 'syntax_highlighting')],
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

        images: this.post.images ? [...this.post.images] : [],
        videos: this.post.videos ? [...this.post.videos] : [],
        resources: this.post.resources ? [...this.post.resources] : [],
        tags: this.post.tags ? [...this.post.tags] : [],

        languages: this.post.languages?.map((lang) => ({ name: lang.name, entity: lang.type })) ?? [],
        technologies: this.post.technologies?.map((tech) => ({ name: tech.name, entity: tech.type })) ?? [],

        category: this.post.category ?? '',
        syntax_highlighting: this.post.syntax_highlighting ?? '',
        post_type: this.post.post_type ?? '',
        status: this.post.status ?? '',
      });
    }
  }

  /**
   * Helper method to get a form control by name. Returns null if the form is not initialized or if the control does not exist.
   *
   * @param name The name of the form control.
   * @returns The form control or null if it does not exist.
   */
  public getControl(name: string): FormControl | null {
    if (!this.postForm) {
      return null;
    }
    return this.postForm.get(name) as FormControl;
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

    this.postFormCode = this.postForm?.get('code')?.value;
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

    const rawValue = this.postForm.getRawValue();

    const data: PostPayload = {
      ...rawValue,
      languages: rawValue.languages.map((lang: TechStackSelectedValueInterface) => lang.name),
      technologies: rawValue.technologies.map((tech: TechStackSelectedValueInterface) => tech.name),
      tags: rawValue.tags.map((tag: TagsInterface) => tag.name),
    };

    this.savePost(data);
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
          this.isProcessing = false;
          const entity = response.data.data.languages?.length ? 'languages' : response.data.data.technologies?.length ? 'technologies' : null;
          const entityValue = response.data.data.languages?.[0]?.name || response.data.data.technologies?.[0]?.name || null;

          if (this.mode === 'edit') {
            this.switchMode('view');
            const updatedPost = response.data.data;
            this.resourceRefresh.emit({ updatedPost, entity, entityValue });
          } else {
            console.log('Post created successfully, navigating to post view with ID:', response.data.data.id);
            const createdPost = response.data.data;
            this.navigateToPostView(createdPost, entity, entityValue);
          }
        },
        error: (error) => {
          console.error('Error saving post:', error);
          this.isProcessing = false;
        },
      });
  }

  /**
   * Navigates to the post view page for the given post.
   * It constructs the URL with query parameters based on the post's languages or technologies to maintain context in the post view.
   *
   * @param post
   * @param entity
   * @param entityValue
   */
  private navigateToPostView(createdPost: PostInterface, entity: string | null, entityValue: string | null): void {
    if (entity && entityValue) {
      this.router.navigate(['/post', createdPost.id], {
        queryParams: {
          selectedEntity: entity,
          selectedEntityValue: entityValue,
        },
        replaceUrl: true,
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Check if the current user is the owner of the post
   *
   * @param post
   * @returns
   */
  public isOwner(post: PostInterface | null): boolean {
    if (post === null) {
      return false;
    }
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
   * Handles the cancel action. If in edit mode, it switches back to view mode.
   * If in create mode, it navigates back to the home page.
   */
  public cancel() {
    if (this.mode === 'edit') {
      this.switchMode('view');
    } else {
      this.router.navigate(['/']);
    }
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

  /**
   * ViewChild reference to the PostTechStackSelector component, used to control the Tech Stack Modal from this parent component.
   */
  @ViewChild('techStackSelector') techStackSelector!: PostTechStackSelector;

  /**
   * Open the Tech Stack Modal
   */
  public openTechStackModal() {
    this.isTechStackSelectorModalOpen = true;
    requestAnimationFrame(() => (this.isTechStackSelectorModalAnimating = true));
  }

  /**
   * Close the Tech Stack Modal
   */
  public closeTechStackModal() {
    this.isTechStackSelectorModalAnimating = false;
  }

  @ViewChild('mediaLinksEditor') mediaLinksEditor!: PostMediaLinksEditor;

  /**
   * Open the Media Links Editor Modal
   */
  public openMediaLinksEditorModal(type: 'images' | 'videos' | 'resources') {
    this.mediaLinksEditorType = type;
    this.isMediaLinksEditorModalOpen = true;
    requestAnimationFrame(() => (this.isMediaLinksEditorModalAnimating = true));
  }

  /**
   * Close the Media Links Editor Modal
   */
  public closeMediaLinksEditorModal() {
    this.isMediaLinksEditorModalAnimating = false;
  }

  /**
   * Open the Tags Modal
   */
  public openTagsModal() {
    this.isTagsModalOpen = true;
    requestAnimationFrame(() => (this.isTagsModalAnimating = true));
  }

  /**
   * Close the Tags Modal
   */
  public closeTagsModal() {
    this.isTagsModalAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  public onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('fade-out')) {
      if (this.isTechStackSelectorModalOpen) {
        this.isTechStackSelectorModalOpen = false;
      }
      if (this.isMediaLinksEditorModalOpen) {
        this.isMediaLinksEditorModalOpen = false;
      }
      if (this.isTagsModalOpen) {
        this.isTagsModalOpen = false;
      }
    }
  }

  /**
   * Generates the external source object based on the current form values for images, videos, and resources.
   * This is used to determine which external sources are enabled for the post.
   *
   * @returns
   */
  public externalSource(): ExternalSourceInterface {
    return {
      images: (this.getControl('images')?.value?.length ?? 0) > 0,
      videos: (this.getControl('videos')?.value?.length ?? 0) > 0,
      resources: (this.getControl('resources')?.value?.length ?? 0) > 0,
    };
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
//   "syntax_highlighting": "php"
// }

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
//         'syntax_highlighting' => ['nullable', 'required_with:languages', 'string', new ValidPostValue('language')],
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
//         'syntax_highlighting' => ['sometimes', 'nullable', 'required_with:languages', 'string', new ValidPostValue('language')],
//     ];
//     return $validationRulesUpdate;
// }
