import { inject, Injectable } from "@angular/core";
import { AuthService } from "../services/auth-service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { map, Observable, take } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      take(1),
      map((firebaseUser) => {
        if (!firebaseUser) {
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRole = route.data?.['role'] as string | undefined;
        const userRole = this.authService.userData()?.role;

        if (requiredRole && userRole !== requiredRole) {
          this.router.navigate(['/home']);
          return false;
        }

        return true;
      })
    );
  }
}