import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../services/AuthService/auth';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Authservice);
  const router = inject(Router);

  // Backend verification
    return auth.current().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/Login']);
      return of(false);
    })
  );
};
