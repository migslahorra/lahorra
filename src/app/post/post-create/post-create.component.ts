import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PostsService } from '../posts.service';
import { mimetype } from './mime-type.validator';  // Import async validator

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  postForm!: FormGroup;
  imagePreview: string | null = null;
  editMode = false;
  postId: string | null = null;

  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    this.postForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      content: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimetype] }),
    });

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.editMode = true;
        this.postId = paramMap.get('postId')!;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          if (!postData) return;

          this.postForm.setValue({
            title: postData.title,
            content: postData.content,
            image: postData.imagePath || null, 
          });

          this.imagePreview = postData.imagePath; 
          this.postForm.get('image')?.clearValidators(); 
          this.postForm.get('image')?.updateValueAndValidity();
        });
      } else {
        this.editMode = false;
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0] || null;

    if (!file) {
      console.error('No file selected');
      return;
    }

    this.postForm.patchValue({ image: file });
    this.postForm.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    if (this.postForm.invalid) {
      return;
    }

    if (this.editMode && this.postId) {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    } else {
      this.postsService.addPost(
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    }

    this.postForm.reset();
    this.imagePreview = null;
    this.router.navigate(['/post-list']);
  }
}