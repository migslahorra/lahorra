import { Component, OnInit } from '@angular/core';
import { AuthService } from 'backend/authentication/auth.service';

interface Post {
  id: number;
  title: any;
  content: any;
}
@Component ({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  constructor(private authservice: AuthService){}
  title = 'Post and Create';

  ngOnInit(){  
    this.authservice.autoAuthUser();  
  }
  // onPostAdded(post: any): void {
  //  this.storedPosts.push(post);
  //}
  // storedPosts = [];
  // onPostAdded(post){
  // this.storedPosts.pust(post)
  //}

}