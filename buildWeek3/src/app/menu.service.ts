import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iMenu } from './Models/i-menu';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  apiUrl: string = 'http://localhost:3000/menu';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<iMenu[]>(this.apiUrl);
  }



  getByCategoryAndAvailability(category: string, availability: boolean): Observable<iMenu[]> {
    const url = `${this.apiUrl}?categoria=${category}&disponibile=${availability}`;
    return this.http.get<iMenu[]>(url);
  }

  getById(id:number){
    return this.http.get<iMenu>(`${this.apiUrl}/${id}`)
  }

  create(newPizza:Partial<iMenu>){
    return this.http.post<iMenu>(this.apiUrl, newPizza)
  }

  update(item:iMenu){
    return this.http.put(`${this.apiUrl}/${item.id}`,item)
  }

  delete(id:number){
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

}
