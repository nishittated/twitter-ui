import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  sidebarShow = false;

  constructor() {
    if (localStorage.getItem('jwt')) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
}