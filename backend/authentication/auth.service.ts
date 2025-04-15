import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";  
import { Router } from "@angular/router";  

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string | null = null;
  private authStatusListener = new Subject<boolean>();  
  private isAuthenticated = false;  
  private tokenTimer: any;  

  constructor(private http: HttpClient, private router: Router) {} 

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ token: string, expiresIn: number }>( 
      "http://localhost:3000/api/user/login",
      authData
    ).subscribe(response => {
      const token = response.token;
      this.token = token;
      if (token) {
        const expiresInDuration = response.expiresIn;  
        this.setAuthTimer(expiresInDuration);  
        setTimeout(() => {}, expiresInDuration * 1000);  
        this.isAuthenticated = true;  
        this.authStatusListener.next(true);
        const now = new Date();  
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);  
        this.saveAuthData(token, expirationDate);  
        this.router.navigate(['/']);   
      }  
    });
  }
  
  private setAuthTimer(duration: number) {  
    this.tokenTimer = setTimeout(() => {  
      this.logout();  
    }, duration * 1000);  
  }

  private saveAuthData(token: string, expirationDate: Date) {  
    localStorage.setItem('token', token);  
    localStorage.setItem('expiration', expirationDate.toISOString());  
  }  

  private clearAuthData() {  
    localStorage.removeItem("token");  
    localStorage.removeItem("expiration");  
  }

  autoAuthUser() {  
    const authInformation = this.getAuthData();  
    if (!authInformation) {  
      return;  
    }  
    const now = new Date();  
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();  
    const isInFuture = authInformation.expirationDate > now;
    if (expiresInDuration > 0) {  
      this.token = authInformation.token;  
      this.isAuthenticated = true;
      this.setAuthTimer(expiresInDuration / 1000);  
      this.authStatusListener.next(true);  
    }   
  }  

  private getAuthData() {  
    const token = localStorage.getItem("token");  
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {  
      return;  
    }  
    return {  
      token: token,  
      expirationDate: new Date(expirationDate)  
    }
  }  

  logout() {  
    this.token = null;  
    this.isAuthenticated = false;  
    this.authStatusListener.next(false); 
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);  
    this.clearAuthData(); 
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {  
    return this.authStatusListener.asObservable();  
  }  

  CreateUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    console.log("Sending data to server:", authData);
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe({
        next: (response) => {
          console.log("Server response:", response);
        },
        error: (error) => {
          console.error("Signup error:", error);
        }
      });
  }
}
