import { Component } from '@angular/core';
import { User } from '../Models/user';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  regName: string = '';
  regEmail: string = '';
  regPassword: string = '';
  loginEmail: string = '';
  loginPassword: string = '';

  onRegister() {
    const newUser: User = {
      id: Date.now(),
      name: this.regName,
      email: this.regEmail,
      password: this.regPassword
    };

    // Qui puoi aggiungere il codice per inviare il nuovo utente al server o salvarlo localmente
    console.log('Nuovo utente registrato:', newUser);
  }

  onLogin() {
    const loginUser: User = {
      id: 0, // L'id non è necessario per il login, quindi può essere impostato a 0 o lasciato vuoto
      name: '', // Il nome non è necessario per il login, quindi può essere lasciato vuoto
      email: this.loginEmail,
      password: this.loginPassword
    };

    // Qui puoi aggiungere il codice per autenticare l'utente con il server
    console.log('Utente loggato:', loginUser);
  }
}
