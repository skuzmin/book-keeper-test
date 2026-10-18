import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { FilterBarComponent } from './filter-bar.component';
import { FormsModule } from '@angular/forms';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilterBarComponent,
        MatIconTestingModule,
        FormsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });


  describe('General', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  });
});
