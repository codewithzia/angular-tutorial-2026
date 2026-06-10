import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import {
  doc,
  Firestore,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  currentUser$ = user(this.auth) as Observable<User | null>;
  isLoggedIn = signal(false);
  userData = signal<AppUser | null>(null);

  constructor() {
    this.currentUser$.subscribe((firebaseUser) => {
      const loggedIn = !!firebaseUser;
      this.isLoggedIn.set(loggedIn);

      if (loggedIn && firebaseUser) {
        this.loadUserData(firebaseUser.uid);
      } else {
        this.userData.set(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('appUser');
        }
      }
    });
  }

  private async loadUserData(uid: string) {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as AppUser;
      this.userData.set(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('appUser', JSON.stringify(data));
      }
    }
  }

  async register(email: string, password: string, displayName?: string) {
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const appUser: AppUser = {
      uid: cred.user.uid,
      email: cred.user.email ?? email,
      displayName: displayName || '',
      role: 'user',
    };
    await setDoc(doc(this.firestore, 'users', cred.user.uid), appUser);
    this.userData.set(appUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appUser', JSON.stringify(appUser));
    }
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    await this.loadUserData(cred.user.uid);
  }

  async logout() {
    await signOut(this.auth);
    this.userData.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('appUser');
    }
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.userData()?.role === 'admin';
  }
}
