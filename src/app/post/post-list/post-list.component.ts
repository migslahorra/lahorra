import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    private postsSub!: Subscription;
    editedPostId: string | null = null;
    imagePreview: string | null = null;
    selectedImage: File | null = null;
    editablePost: { title: string; content: string; imagePath?: string } = { title: '', content: '' };

    constructor (public postsService: PostsService) { }

    ngOnInit() {
      this.postsService.getPosts();
      this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((posts: Post[]) => {
          this.posts = posts;
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

    onDelete(postId: string) {
      this.postsService.deletePost(postId);
    }

    ngOnDestroy() {
      this.postsSub.unsubscribe();
    }
}
