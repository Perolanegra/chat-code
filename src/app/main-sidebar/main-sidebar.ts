import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-main-sidebar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatDividerModule, MatTooltipModule],
  templateUrl: './main-sidebar.html',
  styleUrl: './main-sidebar.scss',
})
export class MainSidebarComponent {}
