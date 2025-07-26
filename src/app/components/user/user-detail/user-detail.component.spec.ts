import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const dummyUser: User = {
    id: 1,
    name: 'John Doe',
    username: 'johnny',
    email: 'john@example.com',
    phone: '1234567890',
    website: 'example.com',
    address: {
      street: 'Street',
      suite: 'Suite',
      city: 'City',
      zipcode: '12345'
    },
    company: {
      name: 'Company',
      catchPhrase: 'Catchy',
      bs: 'bs'
    }
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [{ provide: Router, useValue: mockRouter }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    component.user = dummyUser;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería navegar a la lista de posts del usuario al llamar goToPostsList()', () => {
    component.goToPostsList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/posts', dummyUser.id]);
  });

  it('debería emitir el evento close al cerrar el modal', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
