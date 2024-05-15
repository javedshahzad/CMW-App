import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Role } from './constant/constants';
import { AuthGuard } from './guards/auth.guard';
import { ProfileResolverService } from './services/profile-resolver/profile-resolver.service';
import { TabsPageModule } from './tabs/tabs.module';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'tabs',
    loadChildren: () => {return TabsPageModule},
    //canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'terms',
    loadChildren: () =>
      import('./pages/terms/terms.module').then((m) => m.TermsPageModule),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./pages/edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
    canActivate: [AuthGuard],
    data: { role: [Role.hrAdmin, Role.user] },
    resolve: { user: ProfileResolverService },
  },
  {
    path: 'change-password',
    loadChildren: () =>
      import('./pages/change-password/change-password.module').then(
        (m) => m.ChangePasswordPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'terms-condition',
    loadChildren: () =>
      import('./pages/terms-condition/terms-condition.module').then(
        (m) => m.TermsConditionPageModule
      ),
  },
  {
    path: 'recovery-password',
    loadChildren: () =>
      import('./pages/recovery-password/recovery-password.module').then(
        (m) => m.RecoveryPasswordPageModule
      ),
  },
  {
    path: 'allow-role',
    loadChildren: () =>
      import('./pages/allow-role/allow-role.module').then(
        (m) => m.AllowRolePageModule
      ),
  },
  {
    path: 'hr-calendar-view',
    loadChildren: () => import('./pages/hr-calendar-view/hr-calendar-view.module').then( m => m.HrCalendarViewPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
