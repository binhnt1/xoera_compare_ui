import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminAuthGuard } from './_core/guards/admin.auth.guard';

// Layout
import { LayoutAdminStackComponent } from './_layout.admin.stack/layout.component';
import { LayoutAdminStackSignInComponent } from './_layout.admin.stack/signin/layout.signin.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'admin',
        component: LayoutAdminStackComponent,
        children: [
          { path: 'error', loadChildren: () => import('./_core/modules/error/error.module').then(m => m.ErrorModule) },
          { path: 'user', loadChildren: () => import('./modules/admin/sercurity/user/user.module').then(m => m.UserModule) },
          { path: 'role', loadChildren: () => import('./modules/admin/sercurity/role/role.module').then(m => m.RoleModule) },
          { path: 'smtpaccount', loadChildren: () => import('./modules/admin/smtp.account/smtp.account.module').then(m => m.SmtpAccountModule) },
          { path: 'permission', loadChildren: () => import('./modules/admin/sercurity/permission/permission.module').then(m => m.PermissionModule) },
          { path: 'emailtemplate', loadChildren: () => import('./modules/admin/email.template/email.template.module').then(m => m.EmailTemplateModule) },
          { path: 'useractivity', loadChildren: () => import('./modules/admin/sercurity/user.activity/user.activity.module').then(m => m.UserActivityModule) },
          { path: 'linkpermission', loadChildren: () => import('./modules/admin/sercurity/link.permission/link.permission.module').then(m => m.LinkPermissionModule) },
          { path: '', loadChildren: () => import('./modules/admin/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AdminAuthGuard] },
        ]
      },
      {
        path: 'admin/lock',
        component: LayoutAdminStackSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/admin/sercurity/lock/lock.module').then(m => m.LockModule) },
        ]
      },
      {
        path: 'admin/signin',
        component: LayoutAdminStackSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/admin/sercurity/signin/signin.module').then(m => m.SignInModule) },
        ]
      },
      {
        path: 'admin/verify',
        component: LayoutAdminStackSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/admin/sercurity/verify/verify.module').then(m => m.VerifyModule) },
        ]
      },
      {
        path: 'admin/resetpassword',
        component: LayoutAdminStackSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/admin/sercurity/reset.password/reset.password.module').then(m => m.ResetPasswordModule) },
        ]
      },
      {
        path: 'signin',
        component: LayoutAdminStackSignInComponent,
        children: [
          { path: '', loadChildren: () => import('./modules/admin/sercurity/signin/signin.module').then(m => m.SignInModule) },
        ]
      },
      {
        path: '',
        pathMatch:'full',
        redirectTo: '/admin',
      },
      {
        path: '**',
        redirectTo: '/admin/error/404',
      },
    ], { initialNavigation: 'enabled' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
