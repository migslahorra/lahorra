import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {  Post } from "./post.model";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {

    }
    getPosts() {
        this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(map((postData) => {
            return postData.posts.map((post: any) => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                }
            })
        }))
        .subscribe((transformedPosts) => {
            this.posts = transformedPosts;
            this.postsUpdated.next([...this.posts]);
        })  
    }
    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }
    
    getPost(id: string): Observable<{ id: string; title: string; content: string }> {
        return this.http.get<{ id: string; title: string; content: string }>(`http://localhost:3000/api/posts/${id}`);
      }

    addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };

    this.http.post<{ message: string; postId: string }>('http://localhost:3000/api/posts', post)
        .subscribe((responseData) => {
            console.log("Post created:", responseData.message, "ID:", responseData.postId);

            const newPost: Post = { id: responseData.postId, title: title, content: content };

            this.posts.push(newPost);
            this.postsUpdated.next([...this.posts]);
        });
}

updatePost(id: string, title: string, content: string) {
    const updatedPost = { title, content };

    this.http.put(`http://localhost:3000/api/posts/${id}`, updatedPost)
        .subscribe(response => {
            console.log('Post updated:', response);

            const updatedPosts = [...this.posts];
            const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
            updatedPosts[oldPostIndex] = { ...updatedPosts[oldPostIndex], title, content };

            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        });
}

    deletePost(postId: string){
        this.http.delete('http://localhost:3000/api/posts/' + postId)
        .subscribe(() => {
            console.log('Delete');
            const updatedPosts = this.posts.filter(post => post.id !== postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
        })
    }
}

