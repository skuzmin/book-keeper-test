import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-books',
  templateUrl: './no-books.component.html',
  styleUrl: './no-books.component.scss',
  imports: [MatIconModule]
})

export class NoBooksComponent {
  public addClick = output<void>();
  public importClick = output<void>();
}