import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { NoBooksComponent } from './no-books.component';

describe('NoBooksComponent', () => {
  let component: NoBooksComponent;
  let fixture: ComponentFixture<NoBooksComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoBooksComponent,
        MatIconTestingModule,

      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoBooksComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('General', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });
});
