import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription  } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent {
    posts: Post[] = [];
    private postsSub!: Subscription;

    constructor (public postsService: PostsService) {
    }
    ngOnInit() {
      this.posts = this.postsService.getPosts();
      this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[]) => {
          this.posts = posts;
        });
    }
    ngOnDestroy() {
      this.postsSub.unsubscribe();
    }
}