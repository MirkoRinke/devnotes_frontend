import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * The base URL for the proxy server.
   * The proxy server forwards requests and adds necessary headers (e.g., API keys) to ensure secure communication with the actual API.
   */
  private proxyUrl = 'http://192.168.178.188:9090/backend/proxy.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  /**
   * Sends a GET request to the specified endpoint.
   * @param endpoint The API endpoint to send the request to.
   * @returns An Observable of the response.
   */
  get<T>(endpoint: string): Observable<T> {
    const url = `${this.proxyUrl}${endpoint}`;
    let headers = new HttpHeaders({});
    headers = this.authenticationHeader(headers);

    const response$ = this.http.get<T>(url, { headers });
    return response$;
  }

  /**
   * Sends a POST request to the specified endpoint with the provided data.
   * @param endpoint The API endpoint to send the request to.
   * @param data The data to be sent in the request body.
   * @returns An Observable of the response.
   */
  post<T>(endpoint: string, data: any = null): Observable<T> {
    const url = `${this.proxyUrl}${endpoint}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = this.authenticationHeader(headers);

    const response$ = this.http.post<T>(url, data, { headers });
    return response$;
  }

  /**
   * Sends a PATCH request to the specified endpoint with the provided data.
   * @param endpoint The API endpoint to send the request to.
   * @param data The data to be sent in the request body.
   * @returns An Observable of the response.
   */
  patch<T>(endpoint: string, data: any = null): Observable<T> {
    const url = `${this.proxyUrl}${endpoint}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = this.authenticationHeader(headers);

    const response$ = this.http.patch<T>(url, data, { headers });
    return response$;
  }

  /**
   * Sends a DELETE request to the specified endpoint.
   * @param endpoint The API endpoint to send the request to.
   * @returns An Observable of the response.
   */
  delete<T>(endpoint: string, data: any = null): Observable<T> {
    const url = `${this.proxyUrl}${endpoint}`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    headers = this.authenticationHeader(headers);

    const response$ = this.http.delete<T>(url, { headers, body: data });
    return response$;
  }

  /**
   * Adds authentication headers to the provided HttpHeaders object if the user is logged in.
   *
   * @param headers The HttpHeaders object to which authentication headers will be added.
   * @returns The updated HttpHeaders object with authentication headers if the user is logged in.
   */
  authenticationHeader(headers: HttpHeaders): HttpHeaders {
    if (this.authService.isLoggedIn()) {
      const token = this.authService.getToken();
      const deviceFingerprint = this.authService.getDeviceFingerprint();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
      if (deviceFingerprint) {
        headers = headers.set('X-Device-Fingerprint', deviceFingerprint);
      }
    }

    return headers;
  }
}
