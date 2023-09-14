import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  userFullName: string = '';
  storage: Storage = sessionStorage;

  constructor(public auth : AuthService) {
  }


  ngOnInit(): void {
    if(this.auth.isAuthenticated$) {
      this.getUserDetails();
    }
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  getUserDetails() {
    this.auth.user$.subscribe(
      user => {
        this.userFullName = user.name;
        const email = user.email;
        this.storage.setItem('userEmail', JSON.stringify(email));
      }
    )
  }

  logout() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } })
  }
}
