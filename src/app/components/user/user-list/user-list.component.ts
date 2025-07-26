import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ErrorComponent } from '../../../shared/error/error.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, LoadingComponent, UserDetailComponent, ErrorComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;
  filteredUsers$!: Observable<User[]>;
  searchQuery$ = new BehaviorSubject<string>('');
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  hasError$!: Observable<boolean>;

  currentPage = 1;
  itemsPerPage = 5;

  paginatedUsers$!: Observable<User[]>;
  totalPages$!: Observable<number>;

  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.users$ = this.userService.users$;
    this.loading$ = this.userService.loading$;
    this.error$ = this.userService.error$;

    this.hasError$ = combineLatest([this.error$, this.loading$]).pipe(
      map(([error, loading]) => !!error && !loading)
    );

    this.filteredUsers$ = combineLatest([this.users$, this.searchQuery$]).pipe(
      map(([users, query]) =>
        users.filter((user) =>
          `${user.name} ${user.username} ${user.email} ${user.phone} ${user.website} ${user.address.street}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      )
    );

    this.paginatedUsers$ = combineLatest([this.filteredUsers$]).pipe(
      map(([users]) => {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return users.slice(start, start + this.itemsPerPage);
      })
    );

    this.totalPages$ = this.filteredUsers$.pipe(
      map((users) => Math.ceil(users.length / this.itemsPerPage))
    );

    this.userService.getUsers();
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery$.next(query);
    this.currentPage = 1;
    this.refreshPage();
  }

  nextPage(): void {
    this.totalPages$
      .subscribe((total) => {
        if (this.currentPage < total) {
          this.currentPage++;
          this.refreshPage();
        }
      })
      .unsubscribe();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.refreshPage();
    }
  }

  refreshPage() {
    this.paginatedUsers$ = combineLatest([this.filteredUsers$]).pipe(
      map(([users]) => {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        return users.slice(start, start + this.itemsPerPage);
      })
    );
  }

  openModal(user: User) {
    this.selectedUser = user;
  }

  closeModal() {
    this.selectedUser = null;
  }
}
