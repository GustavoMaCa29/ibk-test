import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss',
})
export class PostFormComponent implements OnInit {
  @Input() post?: Post;
  @Input() userId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ post: Post; message: string }>();

  postForm!: FormGroup;
  isEdit = false;

  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private postService: PostService) {}

  ngOnInit(): void {
    this.isEdit = !!this.post;

    this.postForm = this.fb.group({
      title: [this.post?.title || '', Validators.required],
      body: [this.post?.body || '', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['post'] && changes['post'].currentValue && this.postForm) {
      this.postForm.patchValue({
        title: this.post?.title || '',
        body: this.post?.body || '',
      });
    }
  }

  savePost() {
    const formValue: Post = {
      ...this.post,
      ...this.postForm.value,
      userId: this.post?.userId ?? this.userId,
    };

    if (this.post) {
      this.postService.updatePost(formValue).subscribe({
        next: (updated) =>
          this.emitAndClose(updated, '¡Post actualizado correctamente!'),
        error: () => {
          this.errorMessage = 'Error al actualizar el post';
          setTimeout(() => (this.errorMessage = null), 3000);
        },
      });
    } else {
      this.postService.addPost(formValue).subscribe({
        next: (created) =>
          this.emitAndClose(created, '¡Post creado correctamente!'),
        error: () => {
          this.errorMessage = 'Error al crear el post';
          setTimeout(() => (this.errorMessage = null), 3000);
        },
      });
    }
  }

  private emitAndClose(post: Post, message: string) {
    this.closeModal();
    this.saved.emit({ post, message });
  }

  closeModal() {
    this.close.emit();
  }
}
