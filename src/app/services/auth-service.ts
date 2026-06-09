import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  currentUser$ = user(this.auth) as Observable<User | null>;
  isLoggedIn = signal(false);

  constructor() {
     this.currentUser$.subscribe(user => {
        const loggedIn = !!user;
        this.isLoggedIn.set(loggedIn);
     });
  }

  async login (email:string, password:string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }
  
  async logout () {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

}
