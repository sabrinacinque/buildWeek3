import { Component } from '@angular/core';
import { AuthService } from './auth-service.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  regName: string = '';
  regEmail: string = '';
  regPassword: string = '';
  loginEmail: string = '';
  loginPassword: string = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.register(this.regName, this.regEmail, this.regPassword).subscribe({
      next: (user) => {
        console.log('Nuovo utente registrato:', user);
      },
      error: (error) => {
        console.error('Errore durante la registrazione:', error);
      }
    });
  }

  onLogin() {
    console.log('Email inserita:', this.loginEmail); // Log dell'email inserita
    console.log('Password inserita:', this.loginPassword); // Log della password inserita
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: (user) => {
        if (user) {
          console.log(`Benvenuto, ${user.name}`);
        } else {
          console.log('Credenziali non valide');
        }
      },
      error: (error) => {
        console.error('Errore durante il login:', error);
      }
    });
  }
}
