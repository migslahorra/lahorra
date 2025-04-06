import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

    constructor(private http: HttpClient) {}

    getPosts(pagesize: number, currentpage: number) {
        const queryParams = `?pagesize=${pagesize}&currentpage=${currentpage}`;
        this.http.get<{ message: string; posts: any; maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
            .pipe(
                map(postData => {
                    return {
                        posts: postData.posts.map((post: any) => {
                            return {
                                title: post.title,
                                content: post.content,
                                id: post._id,
                                imagePath: post.imagePath
                            };
                        }),
                        maxPosts: postData.maxPosts
                    };
                })
            )
            .subscribe((transformedPostsData) => {
                this.posts = transformedPostsData.posts;
                // Ensure that the next() method is called with the correct structure
                this.postsUpdated.next({
                    posts: [...this.posts], // Posts is the array
                    postCount: transformedPostsData.maxPosts  // PostCount is the number
                });
            });
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string): Observable<Post> {
        return this.http.get<Post>(`http://localhost:3000/api/posts/${id}`)
            .pipe(catchError(error => {
                console.error("Error fetching post:", error);
                return throwError(() => error);
            }));
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, image.name);

        this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData)
            .subscribe((responseData) => {
                console.log("Post created:", responseData.message);
                const newPost: Post = {
                    id: responseData.post.id,
                    title: title,
                    content: content,
                    imagePath: responseData.post.imagePath
                };
                this.posts.push(newPost);
                this.postsUpdated.next({
                    posts: [...this.posts], // Ensure the correct structure is passed
                    postCount: this.posts.length  // Optionally update the count
                });
            }, (error) => {
                console.error("Error creating post:", error);
            });
    }

    updatePost(id: string, title: string, content: string, image?: File | string) {
        let postData: FormData | Post;

        if (typeof image === "object") {  // If a new file is uploaded
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content", content);
            postData.append("image", image, title);
        } else {  // If only text is updated (image is a string path)
            postData = { id, title, content, imagePath: image || '' };
        }

        this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
            .subscribe(response => {
                console.log('Post updated:', response);
                const updatedPosts = [...this.posts];
                const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
                updatedPosts[oldPostIndex] = { 
                    ...updatedPosts[oldPostIndex], 
                    title, 
                    content, 
                    imagePath: (response as any).imagePath || image 
                };

                this.posts = updatedPosts;
                this.postsUpdated.next({
                    posts: [...this.posts], // Correct structure passed
                    postCount: this.posts.length  // Ensure updated post count
                });
            }, (error) => {
                console.error("Error updating post:", error);
            });
    }

    deletePost(postId: string): Observable<any> {
        return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
    }
}
