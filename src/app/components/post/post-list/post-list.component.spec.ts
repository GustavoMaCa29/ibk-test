import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Post } from '../../../models/post.model';
import { PostService } from '../../../services/post.service';
import { PostListComponent } from './post-list.component';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => '1',
      },
    },
  };

  const dummyPosts: Post[] = [
    { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
    { userId: 2, id: 2, title: 'Post 2', body: 'Body 2' },
  ];

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', [
      'getPosts',
      'deletePost',
    ]);
    mockPostService.loading$ = of(false);
    mockPostService.error$ = of(null);
    mockPostService.posts$ = of(dummyPosts);

    await TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar posts del usuario con userId = 1', (done) => {
    component.posts$.subscribe((posts) => {
      expect(posts.length).toBe(1);
      expect(posts[0].userId).toBe(1);
      done();
    });
  });

  it('debería mostrar modal de edición al llamar openModal()', () => {
    component.openModal(dummyPosts[0]);
    expect(component.showModal).toBeTrue();
    expect(component.selectedPost).toEqual(dummyPosts[0]);
  });

  it('debería cerrar el modal y actualizar posts al guardar', () => {
    spyOn(component, 'onPostSaved').and.callThrough();
    component.onPostSaved(dummyPosts[0]);
    expect(component.showModal).toBeFalse();
    expect(mockPostService.getPosts).toHaveBeenCalled();
  });

  it('debería preparar el post a eliminar', () => {
    component.confirmDelete(dummyPosts[0]);
    expect(component.postToDelete).toEqual(dummyPosts[0]);
    expect(component.showConfirmModal).toBeTrue();
  });

  it('debería cancelar la eliminación correctamente', () => {
    component.cancelDelete();
    expect(component.postToDelete).toBeNull();
    expect(component.showConfirmModal).toBeFalse();
  });

  it('debería eliminar post y actualizar lista', () => {
    mockPostService.deletePost.and.returnValue(of({}));
    component.postToDelete = dummyPosts[0];
    component.deleteConfirmed();
    expect(mockPostService.deletePost).toHaveBeenCalledWith(1);
    expect(mockPostService.getPosts).toHaveBeenCalled();
    expect(component.postToDelete).toBeNull();
    expect(component.showConfirmModal).toBeFalse();
  });

  it('debería manejar errores correctamente', (done) => {
    mockPostService.error$ = of('Error');
    component.ngOnInit();
    fixture.detectChanges();

    component.hasError$.subscribe((hasError) => {
      expect(hasError).toBeTrue();
      done();
    });
  });
});
