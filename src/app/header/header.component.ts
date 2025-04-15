import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "backend/authentication/auth.service"; // Fixed path to match your structure

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy { // Fixed interface spelling
  public userIsAuthenticated = false;
  private authListenerSubs!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() { // Fixed method name (lowercase 'n')
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){  
    this.authService.logout();
  }  
}