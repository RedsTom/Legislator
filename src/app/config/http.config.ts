import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

const AN_BASE_URL = "https://corsproxy.io/?url=https://www.assemblee-nationale.fr"

export function assembleeIntereptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (!req.url.startsWith("@")) {
    return next(req);
  }

  const newUrl = AN_BASE_URL + req.urlWithParams.substring(1);

  const newRequest = req.clone({
    url: newUrl,
  });

  console.log(newRequest.urlWithParams)

  return next(newRequest);
}
