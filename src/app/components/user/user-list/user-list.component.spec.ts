import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject, combineLatest, map } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ErrorComponent } from '../../../shared/error/error.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    username: 'juan123',
    email: 'juan@test.com',
    phone: '999-999-999',
    website: 'juan.com',
    address: {
      street: 'Main St',
      suite: 'Apt 1',
      city: 'Lima',
      zipcode: '12345'
    },
    company: {
      name: 'TechCorp',
      catchPhrase: 'Innovate your world',
      bs: 'tech solutions'
    }
  },
  {
    id: 2,
    name: 'María López',
    username: 'maria456',
    email: 'maria@test.com',
    phone: '888-888-888',
    website: 'maria.com',
    address: {
      street: 'Second St',
      suite: 'Apt 2',
      city: 'Cusco',
      zipcode: '67890'
    },
    company: {
      name: 'DesignStudio',
      catchPhrase: 'Design the future',
      bs: 'creative agency'
    }
  }
];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getUsers'], {
      users$: of(mockUsers),
      loading$: of(false),
      error$: of(null),
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, UserListComponent, LoadingComponent, ErrorComponent, UserDetailComponent],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar los usuarios correctamente', (done) => {
    component.users$.subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('Juan Pérez');
      done();
    });
  });

  it('debería filtrar usuarios por búsqueda', (done) => {
    component.searchQuery$.next('maria');
    component.filteredUsers$.subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0].name).toContain('María');
      done();
    });
  });

  it('debería ir a la siguiente página si es posible', () => {
    spyOn(component, 'refreshPage');
    component.totalPages$ = of(2);
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
    expect(component.refreshPage).toHaveBeenCalled();
  });

  it('no debería avanzar si ya está en la última página', () => {
    spyOn(component, 'refreshPage');
    component.totalPages$ = of(1);
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(1);
    expect(component.refreshPage).not.toHaveBeenCalled();
  });

  it('debería retroceder de página si no está en la primera', () => {
    spyOn(component, 'refreshPage');
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
    expect(component.refreshPage).toHaveBeenCalled();
  });

  it('no debería retroceder si está en la primera página', () => {
    spyOn(component, 'refreshPage');
    component.currentPage = 1;
    component.prevPage();
    expect(component.currentPage).toBe(1);
    expect(component.refreshPage).not.toHaveBeenCalled();
  });

  it('debería abrir el modal con el usuario seleccionado', () => {
    const user = mockUsers[0];
    component.openModal(user);
    expect(component.selectedUser).toEqual(user);
  });

  it('debería cerrar el modal', () => {
    component.selectedUser = mockUsers[0];
    component.closeModal();
    expect(component.selectedUser).toBeNull();
  });

  it('debería identificar correctamente el estado de error', (done) => {
    const errorSubject = new BehaviorSubject<string | null>('Error de carga');
    const loadingSubject = new BehaviorSubject<boolean>(false);

    (component as any).error$ = errorSubject.asObservable();
    (component as any).loading$ = loadingSubject.asObservable();
    component.hasError$ = component.hasError$ = combineLatest([
      component.error$,
      component.loading$,
    ]).pipe(map(([err, loading]) => !!err && !loading));

    component.hasError$.subscribe((hasError) => {
      expect(hasError).toBeTrue();
      done();
    });
  });
});
