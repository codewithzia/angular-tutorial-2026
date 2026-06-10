import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterLink,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  authService = inject(AuthService);
  loggedIn = this.authService.isLoggedIn;
  isAdmin = this.authService.isAdmin;
  myFunction() {
    const x = document.getElementById("navDemo");
    if (x) {
      if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
      } else {
        x.className = x.className.replace(" w3-show", "");
      }
    }
  }
  logout() {
    this.authService.logout();
  }
}
