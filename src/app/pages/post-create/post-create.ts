import { Component } from '@angular/core';
import { PostForm } from '../../components/post/post-form/post-form';

@Component({
  selector: 'app-post-create',
  imports: [PostForm],
  templateUrl: './post-create.html',
  styleUrl: './post-create.scss',
})
export class PostCreate {}
