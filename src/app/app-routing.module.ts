import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostCreateComponent } from './post/post-create/post-create.component';

const routes: Routes = [
  {
    path: 'post-create', component: PostCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
