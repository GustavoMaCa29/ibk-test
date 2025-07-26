import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
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
export class PostFormComponent {
  @Input() post?: Post;
  @Input() userId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Post>();

  postForm!: FormGroup;
  isEdit = false;

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
      this.postService.updatePost(formValue).subscribe((updated) => {
        this.saved.emit(updated); 
        this.closeModal();
      });
    } else {
      this.postService.addPost(formValue).subscribe((created) => {
        this.saved.emit(created);
        this.closeModal();
      });
    }
  }

  closeModal() {
    this.close.emit();
  }
}
