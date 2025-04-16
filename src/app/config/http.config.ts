import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

const CORS_PROXY = "https://corsproxy.io/?url=";
const AN_BASE_URL = "https://corsproxy.io/?url=https://www.assemblee-nationale.fr"

export function assembleeIntereptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if(req.url.startsWith("@")) {
    const newUrl = AN_BASE_URL + req.urlWithParams.substring(1);

    const newRequest = req.clone({
      url: newUrl,
    });

    return next(newRequest);
  }

  if(req.url.startsWith("~")) {
    const newUrl = CORS_PROXY + req.urlWithParams.substring(1);

    const newRequest = req.clone({
      url: newUrl,
    });

    return next(newRequest);
  }

  return next(req);
}
