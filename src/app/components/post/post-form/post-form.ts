import { Component, Input, Output, EventEmitter, inject, DestroyRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { SvgIconsService } from '../../../services/svg.icons.service';

import { LocalDatePipe } from '../../../pipes/local-date-pipe';
import { TranslationService } from '../../../i18n/translation.service';

import { BadgeMessageHandler } from '../../../utils/badge-message-handler';
import { atLeastOne, requiredWith } from '../../../utils/custom-validators';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import type { ApiResponseObjektInterface } from '../../../interfaces/api-response';
import type { PostInterface } from '../../../interfaces/post';
import type { PostPayload } from '../../../interfaces/post-payload';
import type { UserInterface } from '../../../interfaces/user';
import type { TagsInterface } from '../../../interfaces/tags';
import type { TechStackSelectedValueInterface, ResourceRefreshInterface, PostFormErrorsInterface, TerminalLineInterface, ErrorCodeMessagesInterface } from '../../../interfaces/post-form';
import type { ExternalSourceInterface } from '../../../interfaces/post-external-source';

import { badgeMessagesInit } from '../../../interfaces/validation-messages';

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
import { TerminalLog } from '../../terminal-log/terminal-log';
import { Badge } from '../../badge/badge';

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
    TerminalLog,
    Badge,
  ],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() post: PostInterface | null = null;

  @Output() modeChange = new EventEmitter<'view'>();
  @Output() resourceRefresh = new EventEmitter<ResourceRefreshInterface>();

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

  messages: ErrorCodeMessagesInterface = {
    post_type: { ...badgeMessagesInit },
    category: { ...badgeMessagesInit },
    syntax_highlighting: { ...badgeMessagesInit },
    status: { ...badgeMessagesInit },
    title: { ...badgeMessagesInit },
    description: { ...badgeMessagesInit },
    code: { ...badgeMessagesInit },
    language_or_tech_required: { ...badgeMessagesInit },
  };

  private messageKeys: (keyof ErrorCodeMessagesInterface)[] = ['post_type', 'category', 'status', 'title', 'description', 'code', 'syntax_highlighting', 'language_or_tech_required'];

  private msg = new BadgeMessageHandler<ErrorCodeMessagesInterface>(this.messages, 'Post', inject(TranslationService));

  postFormErrors: { [key: string]: PostFormErrorsInterface } | PostFormErrorsInterface = {};
  postTerminalMessages: TerminalLineInterface[] = [];
  submitCount = 0;

  badgeAnimationDelay = 400;

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
      this.initialMessages(this.mode);
    } else if (this.mode === 'edit' && this.post) {
      if (this.isOwner(this.post)) {
        this.patchPostForm();
        if (this.post.user) {
          this.currentUser = this.post.user;
        } else {
          this.loadCurrentUser(this.getCurrentUserId());
        }
        this.initialMessages(this.mode);
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
        post_type: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
        category: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
        status: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),

        title: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(255)] }),
        description: this.fb.control<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(65535), Validators.minLength(15)] }),

        syntax_highlighting: this.fb.control<string>('', { nonNullable: true }),

        // Optional fields (Backend: nullable)
        code: this.fb.control<string>('', { nonNullable: true, validators: [Validators.maxLength(65535), Validators.required] }), //TODO Required for Testing purposes, change later to optional

        images: this.fb.control<string[]>([], { nonNullable: true }),
        videos: this.fb.control<string[]>([], { nonNullable: true }),
        resources: this.fb.control<string[]>([], { nonNullable: true }),

        tags: this.fb.control<Array<TagsInterface>>([], { nonNullable: true }),

        // Special case: Conditional required fields (required_without)
        languages: this.fb.control<Array<TechStackSelectedValueInterface>>([], { nonNullable: true }),
        technologies: this.fb.control<Array<TechStackSelectedValueInterface>>([], { nonNullable: true }),
      },
      {
        validators: [atLeastOne(['languages', 'technologies'], 'language_or_tech_required'), requiredWith('languages', 'syntax_highlighting', 'syntax_highlighting')],
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
   * Initializes the terminal messages based on the mode of the form.
   * In edit mode, it shows messages related to loading post data.
   * in create mode, it prompts the user to fill out the form.
   *
   * @param messageMode The mode of the form, either 'edit' or 'create', used to determine which initial messages to display in the terminal log.
   */
  private initialMessages(messageMode: string): void {
    if (messageMode === 'edit') {
      this.pushNewTerminalMessage(
        [
          { text: '[System] Edit mode initialized.', level: 'system' },
          { text: '[System] Loading post data...', level: 'system' },
          { text: '[System] Syntax Highlighting enabled for ' + (this.post?.syntax_highlighting || 'None'), level: 'system' },
        ],
        true,
      );
    } else if (messageMode === 'create') {
      this.pushNewTerminalMessage(
        [
          { text: '[System] Create mode initialized.', level: 'system' },
          { text: '[Info] Please fill out the form and submit to create a new post.', level: 'info' },
        ],
        true,
      );
    }
  }

  /**
   * Pushes new messages to the terminal log. It accepts either a single message or an array of messages and an optional reset flag.
   *
   * @param message The message or array of messages to add to the terminal log.
   * @param reset If true, replaces the existing messages with the new ones; otherwise, appends the new messages.
   */
  private pushNewTerminalMessage(message: TerminalLineInterface | TerminalLineInterface[], reset?: boolean): void {
    const newMessages = Array.isArray(message) ? message : [message];
    if (reset) {
      this.postTerminalMessages = [...newMessages];
    } else {
      this.postTerminalMessages = [...this.postTerminalMessages, ...newMessages];
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
    this.postFormErrors = {};
    this.submitCount = 0;
    this.messageKeys.forEach((key) => this.msg.clearMessage(key));
    this.initialMessages(this.mode);

    this.postFormCode = this.postForm?.get('code')?.value;
  }

  /**
   * Handles form submission. Validates the form and either creates a new post or updates an existing one based on the mode.
   *
   * @returns
   */
  public onSubmit(): void {
    if (!this.postForm) return;

    //TODO Activate this check after testing. It should prevent unnecessary submissions when no changes were made to the form.
    // if (this.postForm.pristine) {
    //   this.pushNewTerminalMessage({ text: '[Info] No changes detected. Please modify the form before submitting.', level: 'info' }, true);
    //   return;
    // }

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.processFormValidation();
      // this.setErrorMessage(this.messageKeys);
      return;
    }

    if (this.postForm.valid) {
      this.pushNewTerminalMessage(
        [
          { text: '[System] Validating in process...', level: 'system' },
          { text: '[Success] Validation: OK', level: 'success' },
          { text: '[System] Syncing with database...', level: 'system' },
        ],
        true,
      );
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

  /**
   * Generates a structured object containing the current form errors.
   * It iterates through all form controls and collects their validation errors, as well as any form-level errors.
   * The resulting object is stored in the `postFormErrors` property for use in the template to display error messages.
   *
   * @returns void
   */
  processFormValidation(): void {
    if (!this.postForm || this.postForm.valid) {
      this.postFormErrors = {};
      return;
    }
    this.submitCount++;

    if (this.submitCount > 1) {
      this.pushNewTerminalMessage({ text: '[System] Re-validating form and clearing old logs...', level: 'system' }, true);
    } else {
      this.pushNewTerminalMessage({ text: '[System] Validating in process...', level: 'system' }, true);
    }

    this.pushNewTerminalMessage({ text: '[Error] Form validation failed. Please check the errors and try again.', level: 'error' });

    this.setErrorMessage();
    this.terminalMessages();
  }

  /**
   * Generates human-readable error messages based on the current form errors.
   * It maps each error to a specific message format and stores them in the `postTerminalMessages` array for display in the template.
   */
  public terminalMessages(): void {
    const messages: TerminalLineInterface[] = [];
    const errors = this.postFormErrors;

    const labels: { [key: string]: string } = {
      post_type: 'Post Typ',
      category: 'Category',
      status: 'Status',
      title: 'Title',
      description: 'Description',
      code: 'Code Block',
      language_or_tech_required: 'Language/Technology',
      syntax_highlighting: 'Syntax Highlighting',
    };

    Object.keys(errors).forEach((key, index) => {
      const errorData = (errors as any)[key] as PostFormErrorsInterface;

      if (typeof errorData === 'object' && errorData !== null) {
        if (errorData.required) {
          messages.push({ text: `[E${index + 1}] ${labels[key] || key}: is required.`, level: 'error' });
        }
        if (errorData.maxlength) {
          messages.push({ text: `[E${index + 1}] ${labels[key] || key}: Text too long.`, level: 'error' });
        }
        if (errorData.minlength) {
          messages.push({ text: `[E${index + 1}] ${labels[key] || key}: Text too short.`, level: 'error' });
        }
      } else if (errorData === true) {
        if (key === 'syntax_highlighting') {
          messages.push({ text: `[E${index + 1}] ${labels[key]}: Since you have chosen languages, highlighting is required.`, level: 'error' });
        }
        if (key === 'language_or_tech_required') {
          messages.push({ text: `[E${index + 1}] ${labels[key]}: Please select at least one language or technology.`, level: 'error' });
        }
      }
    });

    this.pushNewTerminalMessage(messages);
  }

  /**
   * Retrieves the validation errors from the form controls and returns an object containing the errors for each control.
   * It iterates through the form controls, checks if they are invalid, and if so, adds their errors to the resulting object.
   *
   * @returns
   */
  private getFormErrors() {
    const errors: { [key: string]: ErrorCodeMessagesInterface } = {};
    Object.entries(this.postForm?.controls || {}).forEach(([key, control]) => {
      if (control.invalid && control.errors) {
        (errors as any)[key] = control.errors;
      }
    });
    return errors;
  }

  /**
   * Helper method to get the index of a specific error type for a form control or null if the error type is not present.
   * This is used to display error badges in the template with a corresponding error code.
   *
   * @param fieldKey The key of the form control.
   * @returns The index of the error or null if not present.
   */
  getErrorIndex(fieldKey: string): number | null {
    const activeErrors = Object.keys(this.postFormErrors);
    const index = activeErrors.indexOf(fieldKey);
    return index !== -1 ? index + 1 : null;
  }

  /**
   * Sets the error messages for the specified fields based on the current form errors.
   * It checks if each field has an error and sets the corresponding message using the BadgeMessageHandler.
   * If a field does not have an error, it clears any existing message for that field.
   *
   */
  private setErrorMessage(): void {
    const controlErrors = this.getFormErrors();
    const formErrors = this.postForm?.errors || {};
    const allErrors = { ...controlErrors, ...formErrors };
    this.postFormErrors = allErrors;

    this.messageKeys.forEach((field) => {
      const errorIndex = this.getErrorIndex(field);
      if (allErrors[field as string] && errorIndex) {
        this.msg.setMessage(field, 'error', 'E', { index: errorIndex });
      } else {
        this.msg.clearMessage(field);
      }
    });
  }

  /**
   * Determines whether to show the syntax highlighting badge message based on the current form errors and values.
   *
   * @returns True if the syntax highlighting badge message should be shown, false if it should not be shown.
   */
  public getSyntaxHighlightingBadgeMessage(): boolean {
    const hasSubmitError = this.postFormErrors && this.postFormErrors['syntax_highlighting'];
    const hasLanguagesSelected = (this.getControl('languages')?.value?.length ?? 0) > 0;

    const isSyntaxEmpty = this.getControl('syntax_highlighting')?.value === '';
    const isSyntaxInvalid = this.postForm?.hasError('syntax_highlighting');

    if (hasSubmitError && isSyntaxInvalid) {
      this.msg.setMessage('syntax_highlighting', 'error', 'E', { index: this.getErrorIndex('syntax_highlighting') ?? 0 });
      return true;
    }

    if (hasLanguagesSelected && isSyntaxEmpty) {
      this.msg.setMessage('syntax_highlighting', 'info', 'syntax_highlighting_required');
      return true;
    }

    return false;
  }

  /**
   * Saves the post by sending a request to the API. It determines whether to create a new post or update an existing one based on the mode.
   *
   * @param data The payload containing the post data to be saved.
   * @returns The saved post object or void if the save operation is not allowed.
   */
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
            console.log('Post updated successfully, switching to view mode with ID:', response.data.data.id);
            this.pushNewTerminalMessage({ text: '[Success] Post successfully updated!', level: 'success' });

            setTimeout(() => {
              this.switchMode('view');
              const updatedPost = response.data.data;
              this.resourceRefresh.emit({ updatedPost, entity, entityValue });
            }, 2500);
          } else {
            console.log('Post created successfully, navigating to post view with ID:', response.data.data.id);
            this.pushNewTerminalMessage({ text: '[Success] Post successfully created!', level: 'success' });

            setTimeout(() => {
              const createdPost = response.data.data;
              this.navigateToPostView(createdPost, entity, entityValue);
            }, 2500);
          }
        },
        error: (error) => {
          console.error('Error saving post:', error);
          this.pushNewTerminalMessage([
            { text: '[Error] Error saving post!', level: 'error' },
            { text: '[Error] Please try again.', level: 'error' },
          ]);
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
