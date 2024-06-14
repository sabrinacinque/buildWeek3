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

  getAll() {  //Questo metodo effettua una richiesta GET all'URL di base per ottenere tutti gli elementi del menu. Restituisce un Observable di un array di iMenu.
    return this.http.get<iMenu[]>(this.apiUrl);
  }



  getByCategoryAndAvailability(category: string, availability: boolean): Observable<iMenu[]> {  //richiesta GET con parametri di query per filtrare gli elementi del menu in base alla categoria e alla disponibilità.
    const url = `${this.apiUrl}?categoria=${category}&disponibile=${availability}`;
    return this.http.get<iMenu[]>(url);
  }

  getById(id:number){
    return this.http.get<iMenu>(`${this.apiUrl}/${id}`)
  }

  create(newPizza:Partial<iMenu>){
    return this.http.post<iMenu>(this.apiUrl, newPizza) //metodo effettua una richiesta POST per creare un nuovo elemento del menu.
  }

  update(item:iMenu){
    return this.http.put(`${this.apiUrl}/${item.id}`,item)
  }

  delete(id:number){
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

}
