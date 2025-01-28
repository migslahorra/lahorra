import { Component } from '@angular/core';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  title = 'Post and Create';
  newPost = 'Post Content';
  titlePost = 'Title Conent';
  titleValue = 'Enter Title';
  enteredValue = 'Enter Description';

  onAddPost(){
    this.titlePost = this.titleValue;
    this.newPost = this.enteredValue;
  }
}
