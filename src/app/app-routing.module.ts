import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/admin.guard';
import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './pages/callback/callback.component';
import { HomeComponent } from './pages/home/home.component';
import { MyRsvpsComponent } from './pages/my-rsvps/my-rsvps.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'event/:id',
    loadChildren: './pages/event/event.module#EventModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'my-rsvps',
    component: MyRsvpsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: './pages/admin/admin.module#AdminModule',
    canActivate: [AuthGuard, AdminGuard]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule {}
