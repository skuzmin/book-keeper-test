import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { NotificationComponent } from './notification.component';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotificationComponent,
        MatIconTestingModule,
        CommonModule
      ], providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: { message: 'Test', type: 'success' } },
        { provide: MatSnackBarRef, useValue: { dismiss: () => { } } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('General', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });
});
