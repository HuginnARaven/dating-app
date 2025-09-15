import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../services/account-service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accounService = inject(AccountService);

  const user = accounService.currentUser();

  if (user){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    })
  }

  return next(req);
};
