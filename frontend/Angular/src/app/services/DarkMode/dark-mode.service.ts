import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private document = inject(DOCUMENT);
  
  // Signal for dark mode state
  isDarkMode = signal<boolean>(this.loadFromCookie());

  constructor() {
    // Apply dark mode on initialization
    this.applyTheme(this.isDarkMode());

    // Effect to save to cookie and apply theme when state changes
    effect(() => {
      const isDark = this.isDarkMode();
      this.saveToCookie(isDark);
      this.applyTheme(isDark);
    });
  }

  toggle(): void {
    this.isDarkMode.set(!this.isDarkMode());
  }

  private applyTheme(isDark: boolean): void {
    const body = this.document.body;
    const html = this.document.documentElement;
    
    if (isDark) {
      body.classList.add('dark-mode');
      html.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      html.classList.remove('dark-mode');
    }
  }

  private saveToCookie(isDark: boolean): void {
    // Save to cookie with 1 year expiration
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    this.document.cookie = `darkMode=${isDark}; expires=${expires.toUTCString()}; path=/`;
  }

  private loadFromCookie(): boolean {
    // Read from cookie
    const cookies = this.document.cookie.split(';');
    const darkModeCookie = cookies.find(cookie => cookie.trim().startsWith('darkMode='));
    
    if (darkModeCookie) {
      const value = darkModeCookie.split('=')[1];
      return value === 'true';
    }
    
    // Default to light mode if no cookie found
    return false;
  }
}
