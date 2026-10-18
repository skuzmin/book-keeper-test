import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-title-bar-actions',
  templateUrl: './title-bar-actions.component.html',
  styleUrl: './title-bar-actions.component.scss',
  imports: [MatIconModule, MatMenuModule]
})

export class TitleBarActionsComponent {
  public addClick = output<void>();
  public exportClick = output<void>();
  public importClick = output<void>();
}