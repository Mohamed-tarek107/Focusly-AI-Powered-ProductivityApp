import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../services/AuthService/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Authservice);
  const router = inject(Router);

  const token = auth.getaccessToken();
  if (token) return true;

  router.navigate(['/Login']);
  return false;
};
