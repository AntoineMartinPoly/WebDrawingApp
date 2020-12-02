import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainVueComponent } from './components/main-vue/main-vue.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MainVueComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
