import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, Observable, of, switchMap, timer } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/posts';

  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    timer(500)
      .pipe(
        switchMap(() =>
          this.http.get<Post[]>(this.API_URL).pipe(
            catchError(err => {
              this.errorSubject.next('Error al cargar los posts');
              return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
          )
        )
      )
      .subscribe(data => this.postsSubject.next(data));
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.API_URL, post);
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.API_URL}/${post.id}`, post);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
