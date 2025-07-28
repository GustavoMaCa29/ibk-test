import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';
import { PostFormComponent } from '../post-form/post-form.component';
import { map, Observable } from 'rxjs';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { ErrorComponent } from '../../../shared/error/error.component';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostFormComponent,
    LoadingComponent,
    ErrorComponent,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit {
  posts$!: Observable<Post[]>;
  userId!: number;
  loading$!: Observable<boolean>;
  hasError$!: Observable<boolean>;
  error$!: Observable<string | null>;

  selectedPost?: Post;
  showModal = false;

  showConfirmModal = false;
  postToDelete: Post | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading$ = this.postService.loading$;
    this.error$ = this.postService.error$;
    this.hasError$ = this.error$.pipe(map((err) => !!err));

    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    if (this.userId) {
      this.refreshPosts();
      this.posts$ = this.postService.posts$.pipe(
        map((posts) => posts.filter((post) => post.userId === this.userId))
      );
    }
  }

  openModal(post?: Post) {
    this.selectedPost = post;
    this.showModal = true;
  }

  onPostSaved(data: { post: Post; message: string }) {
    this.successMessage = '';
    this.showModal = false;

    setTimeout(() => {
      this.successMessage = data.message;
      this.cdr.detectChanges();
    }, 0);

    this.refreshPosts();
  }

  confirmDelete(post: Post) {
    this.postToDelete = post;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.postToDelete = null;
    this.showConfirmModal = false;
  }

  deleteConfirmed() {
    if (!this.postToDelete) return;

    this.postService.deletePost(this.postToDelete.id).subscribe({
      next: () => {
        this.successMessage = '¡Post eliminado correctamente!';
        this.postToDelete = null;
        this.showConfirmModal = false;
        this.cdr.detectChanges();
        this.refreshPosts();
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el post';
        this.showConfirmModal = false;
        this.postToDelete = null;
        this.cdr.detectChanges();
      },
    });
  }

  private refreshPosts() {
    this.postService.getPosts();
  }
}