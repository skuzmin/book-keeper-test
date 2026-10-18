import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TitleBarActionsComponent } from './title-bar-actions.component';

describe('TitleBarActionsComponent', () => {
  let component: TitleBarActionsComponent;
  let fixture: ComponentFixture<TitleBarActionsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TitleBarActionsComponent,
        MatIconTestingModule,

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TitleBarActionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  describe('General', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });
});
