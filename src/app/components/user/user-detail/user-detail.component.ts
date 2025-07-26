import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  goToPostsList() {
    this.router.navigate(['/posts', this.user.id]);
  }

  closeModal() {
    this.close.emit();
  }
}
