import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // URL del tuo server JSON

  constructor(private http: HttpClient) {}

  register(regName: string, regEmail: string, regPassword: string): Observable<User> {
    const newUser: User = {
      id: Date.now(),
      name: regName,
      email: regEmail,
      password: regPassword
    };

    return this.http.post<User>(this.apiUrl, newUser);
  }
  login(loginEmail: string, loginPassword: string): Observable<User | null> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        console.log('Utenti ricevuti:', users); // Log degli utenti ricevuti
        const user = users.find(u => {
          console.log('Confronto utente:', u.email, u.password); // Log delle credenziali dell'utente
          return u.email.trim() === loginEmail.trim() && u.password.trim() === loginPassword.trim();
        }) || null;
        console.log('Utente trovato:', user); // Log dell'utente trovato
        return user;
      })
    );
  }
}
