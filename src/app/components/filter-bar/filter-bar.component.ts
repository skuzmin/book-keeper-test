import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  imports: [MatIconModule, FormsModule]
})

export class FilterBarComponent {
  public filterText: string = '';
  public filterTextChange = output<string>();

  clearFilter(): void {
    this.filterText = '';
    this.filterTextChange.emit('');
  }
}