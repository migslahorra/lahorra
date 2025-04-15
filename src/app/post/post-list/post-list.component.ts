import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'backend/authentication/auth.service'; // ✅ FIXED: Import AuthService

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  totalposts = 10;
  postperpage = 2;
  currentpage = 1;
  pageSizeOption = [1, 2, 5, 10];
  posts: Post[] = [];

  private postsSub!: Subscription;
  private authStatusSub!: Subscription; 

  editedPostId: string | null = null;
  imagePreview: string | null = null;
  selectedImage: File | null = null;
  editablePost: { title: string; content: string; imagePath?: string } = { title: '', content: '' };

  userIsAuthenticated = false; 

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postsService.getPosts(this.postperpage, this.currentpage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
        this.totalposts = postData.postCount;
      });

    this.userIsAuthenticated = this.authService.getIsAuth(); 

    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => { 
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onEdit(post: Post) {
    this.editedPostId = post.id;
    this.editablePost = { title: post.title, content: post.content, imagePath: post.imagePath };
    this.imagePreview = post.imagePath;
  }

  onImagePicked(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0] || null;

    if (!file) {
      console.error('No file selected');
      return;
    }

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveEdit(postId: string) {
    if (!this.editablePost.title || !this.editablePost.content) return;

    this.postsService.updatePost(
      postId,
      this.editablePost.title,
      this.editablePost.content,
      this.selectedImage || undefined
    );

    this.editedPostId = null;
    this.imagePreview = null;
  }

  onChangedPage(pageData: PageEvent) {
    this.currentpage = pageData.pageIndex + 1;
    this.postperpage = pageData.pageSize;
    this.postsService.getPosts(this.postperpage, this.currentpage);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId)
      .subscribe(() => {
        this.postsService.getPosts(this.postperpage, this.currentpage);
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe()
  }
}
