import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { AppUser } from '../models/appuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  currentUser$ = user(this.auth) as Observable<User | null>;
  isLoggedIn = signal(false);
  userData = signal<AppUser | null>(null);
  isAdmin = signal(false);
  constructor() {
     this.currentUser$.subscribe(user => {
        const loggedIn = !!user;
        this.isLoggedIn.set(loggedIn);
        if (loggedIn && user) {
          this.loadUserData(user.uid);
        }
        else{
           if(typeof window !== 'undefined') {
            localStorage.removeItem('user');
          }
        }
     });
  }

  async login (email:string, password:string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    await this.loadUserData(cred.user.uid);
  }

  private async loadUserData (uid:string) {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as AppUser;
      this.userData.set(data);
      if(typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
      }
      this.checkAdmin();
    }
  }
  
  async register(email: string, password: string, name: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const appUser : AppUser = {
      uid : cred.user.uid,
      email : cred.user.email??email,
      name: name,
      role:'user'
    }
    await setDoc(doc(this.firestore, 'users', cred.user.uid), appUser);
    this.userData.set(appUser);
    // set into local storage
    if(typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(appUser));
    }
  }

  async logout () {
    await signOut(this.auth);
    this.userData.set(null);
    if(typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }

  checkAdmin(){
    const user = this.userData();
    if (user && user.role === 'admin') {
      this.isAdmin.set(true);
    }
    else {
      this.isAdmin.set(false);
    }
  }
}
