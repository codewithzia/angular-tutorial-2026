import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth-service";
import { CanActivate, Router } from "@angular/router";
import { map, Observable, take } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  implements CanActivate {
    private authService = inject(AuthService);
      private router = inject(Router);

      canActivate(): Observable<boolean> | boolean {
        return this.authService.currentUser$.pipe(
        take(1),
        map((user) => {
          if (user) {
            return true;
          }
          this.router.navigate(['/login']);
          return false;
        })
      );
    }
  }