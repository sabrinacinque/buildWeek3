import { Component } from '@angular/core';
import { AuthService } from './auth-service.service';
import { User } from '../Models/user';
import { Router } from '@angular/router';
import { iLogin } from '../Models/ilogin';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  newUser: Partial<User> = {};
  userLogged: iLogin = {
    email: 'hita@mailinator.com',
    password: 'Pa$$w0rd!',
  };


  isLogged:boolean = this.authService.isLogged

  userForm!:FormGroup

  ngOnInit(){
    this.userForm = this.authService.getUserLogin()
  }

  register() {
    return this.authService.register(this.newUser).subscribe(()=> {
      this.router.navigate(['/auth'])
    });
  }



  login():void {
    if(this.userForm.invalid || this.userForm.untouched){
      Swal.fire({
        title: 'Attenzione! Email o Password Errati o non inseriti',
        text: 'Controlla i dati o registrati se non sei registrato',
        icon: 'warning',
      });
    } else {
      this.authService.createNew(this.userLogged, this.userForm)
    this.authService.login(this.userLogged).subscribe(() => {
      Swal.fire({
        text:"Login effettuato con successo!",
        icon: "success"});
      this.router.navigate(['/dashboard']);
    }, (error) => {
      Swal.fire({
        title: 'Attenzione! Email o Password Errati o non inseriti',
        text: 'Controlla i dati o registrati se non sei registrato',
        icon: 'warning',
      });
    });
  }}

  logout() {
    this.authService.logout();
  }
}
