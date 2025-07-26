import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, of, switchMap, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private API_URL = 'https://jsonplaceholder.typicode.com/users';

  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUsers() {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    timer(500)
      .pipe(
        switchMap(() => 
          this.http.get<User[]>(this.API_URL).pipe(
            catchError(err => {
              this.errorSubject.next('Error al cargar los usuarios');
              return of([]);
            }),
            finalize(() => this.loadingSubject.next(false))
          )
        )
      )
      .subscribe(data => this.usersSubject.next(data));
  }
}