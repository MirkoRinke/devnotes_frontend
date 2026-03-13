import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../../services/api.service';

import { atLeastOne } from '../../../utils/custom-validators';

import { LocalDatePipe } from '../../../pipes/local-date-pipe';

import type { PostInterface } from '../../../interfaces/post';
import type { PostPayload } from '../../../interfaces/post-payload';

import { QueryParamsDropdown } from '../../query-params-dropdown/query-params-dropdown';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, LocalDatePipe, QueryParamsDropdown],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() post: PostInterface | null = null;

  @Output() modeChange = new EventEmitter<'view'>();

  postForm: FormGroup | null = null;

  currentDate = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createPostForm();
    console.log('PostForm:', this.postForm?.value);

    if (this.mode === 'edit' && this.post) {
      this.patchPostForm();
      console.log('Edit Mode Patched PostForm:', this.postForm?.value);
    }
  }

  /**
   * Helper method to get the default value for a form control. If the control has a value, it returns that; otherwise, it returns the provided fallback value.
   *
   * @param controlName The name of the form control.
   * @param fallback The fallback value to return if the control has no value.
   * @returns The value of the form control or the fallback value.
   */
  getDefaultValue(controlName: string, fallback: string): string {
    const value = this.postForm?.get(controlName)?.value;
    return value && typeof value === 'string' ? value : fallback;
  }

  /**
   * Creates the form group with all necessary controls and validators.
   *
   */
  createPostForm() {
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
  patchPostForm() {
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
  resetForm() {
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
  onSubmit() {
    if (!this.postForm) return;

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const formData: PostPayload = this.postForm.getRawValue();

    if (this.mode === 'edit' && this.post?.id) {
      this.updatePost(this.post.id, formData);
    } else {
      this.createPost(formData);
    }
  }

  /**
   * TODO Placeholder method for creating a new post.
   *
   * @param data
   */
  createPost(data: PostPayload) {
    console.log('Creating post with data:', data);
  }

  /**
   * TODO Placeholder method for updating a post.
   *
   * @param id
   * @param data
   */
  updatePost(id: number, data: PostPayload) {
    console.log(`Updating post ${id} with data:`, data);
  }

  /**
   * Switches the mode of the form.
   *
   * @param newMode
   */
  switchMode(newMode: 'view') {
    this.modeChange.emit(newMode);
  }

  getAllowedValuesParams(type: string): string[] {
    let query = [`?filter[type]=${type}&select=count:name`];
    return query;
  }

  patchDropdownValues(values: string, type: string) {
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
