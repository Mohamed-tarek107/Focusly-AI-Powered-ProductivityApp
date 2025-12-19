import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DarkModeService } from '../../services/DarkMode/dark-mode.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  isCollapsed = false;

  constructor(
    public darkMode: DarkModeService,
    private router: Router
  ) {}

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDarkMode() {
    this.darkMode.toggle();
  }

  // Show dark mode button on all pages
  get showDarkModeToggle(): boolean {
    return true;
  }
}
