import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busy-service';
import { delay, finalize, of, tap } from 'rxjs';

const cache = new Map<string, any>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const genrateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params.keys().map(key => `${key}=${params.get(key)}`).join('&');
    return paramString ? `${url}?${paramString}` : url;
  }

  const cacheKey = genrateCacheKey(req.url, req.params);

  if (req.method === 'GET'){
    const cacheResponse = cache.get(cacheKey);
    if (cacheResponse){
      return of(cacheResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    delay(500),
    tap(response => {
      cache.set(cacheKey, response)
    }),
    finalize(() => {
      busyService.idle()
    })
  );
};
