import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

export const MATERIAL_IMPORTS = [
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatDialogModule,
] as const;