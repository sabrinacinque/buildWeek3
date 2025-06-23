import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iMenu } from './Models/i-menu';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MenuService {

  apiUrl: string = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  // ✅ Funziona già perfettamente con Spring Boot GET /api/menu
  getAll(): Observable<iMenu[]> {
    return this.http.get<iMenu[]>(this.apiUrl);
  }

  // 🔧 AGGIORNATO: Spring Boot non ha filtri query, implementiamo lato client
  getByCategoryAndAvailability(
    category: string,
    availability: boolean
  ): Observable<iMenu[]> {
    // Per ora otteniamo tutti i menu e filtriamo lato client
    // Più tardi potremo aggiungere endpoint specifici in Spring Boot se necessario
    return this.http.get<iMenu[]>(this.apiUrl);
  }

  // ✅ Funziona già con Spring Boot GET /api/menu/{id}
  getById(id: number): Observable<iMenu> {
    return this.http.get<iMenu>(`${this.apiUrl}/${id}`);
  }

  // ✅ Funziona già con Spring Boot POST /api/menu
  create(newMenuItem: Partial<iMenu>): Observable<iMenu> {
    return this.http.post<iMenu>(this.apiUrl, newMenuItem);
  }

  // ✅ Funziona già con Spring Boot PUT /api/menu/{id}
  update(item: iMenu): Observable<iMenu> {
    return this.http.put<iMenu>(`${this.apiUrl}/${item.id}`, item);
  }

  // ✅ Funziona già con Spring Boot DELETE /api/menu/{id}
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 🆕 NUOVO: Usa il nuovo endpoint Spring Boot
  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // 🆕 NUOVO: Verifica se un menu esiste
  exists(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${id}`);
  }
}
