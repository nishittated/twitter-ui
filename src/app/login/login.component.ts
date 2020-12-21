import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private http: HttpClient) { }

  ngOnInit() { }

  redirectToTwitter() {
    this.http.post('http://localhost:3010/twitter/login', {})
      .subscribe((requestToken: any) => {
        console.log("requestToken sent successfully >>", requestToken);
        location.href = requestToken.redirectUrl;
      },
        error => {
          console.log("requestToken failed >>", error);
          alert('Login Failed. Contact app administrator.');
        })
  }
}