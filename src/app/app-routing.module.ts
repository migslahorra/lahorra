import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { logincomponent } from 'backend/authentication/login/login.component';
import { signupcomponent } from 'backend/authentication/signup/signup.component';
import { AuthGuard } from 'backend/authentication/auth.guard';

const routes: Routes = [
  { path: '', component: PostCreateComponent},
  { path: 'post-create', component: PostCreateComponent },
  { path: 'post-list', component: PostListComponent },
  { path: 'login', component: logincomponent },
  { path: 'signup', component: signupcomponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]  
})
export class AppRoutingModule { 
  
}