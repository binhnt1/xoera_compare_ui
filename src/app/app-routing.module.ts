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
          { path: 'ccl', loadChildren: () => import('./modules/admin/ccl/ccl.module').then(m => m.CclModule) },
          { path: 'site', loadChildren: () => import('./modules/admin/site/site.module').then(m => m.SiteModule) },
          { path: 'error', loadChildren: () => import('./_core/modules/error/error.module').then(m => m.ErrorModule) },
          { path: 'notice', loadChildren: () => import('./modules/admin/notice/notice.module').then(m => m.NoticeModule) },
          { path: 'broker', loadChildren: () => import('./modules/admin/broker/broker.module').then(m => m.BrokerModule) },
          { path: 'user', loadChildren: () => import('./modules/admin/sercurity/user/user.module').then(m => m.UserModule) },
          { path: 'role', loadChildren: () => import('./modules/admin/sercurity/role/role.module').then(m => m.RoleModule) },
          { path: 'hubfile', loadChildren: () => import('./modules/admin/hubfile/hubfile.module').then(m => m.HubFileModule) },
          { path: 'sendemail', loadChildren: () => import('./modules/admin/bulk.email/bulk.email.module').then(m => m.BulkEmailModule) },
          { path: 'brokerlead', loadChildren: () => import('./modules/admin/broker.lead/broker.lead.module').then(m => m.BrokerLeadModule) },
          { path: 'smtpaccount', loadChildren: () => import('./modules/admin/smtp.account/smtp.account.module').then(m => m.SmtpAccountModule) },
          { path: 'crawwebsite', loadChildren: () => import('./modules/admin/craw.website/craw.website.module').then(m => m.CrawWebsiteModule) },
          { path: 'crawkeyword', loadChildren: () => import('./modules/admin/craw.keyword/craw.keyword.module').then(m => m.CrawKeywordModule) },
          { path: 'helpquestion', loadChildren: () => import('./modules/admin/help.question/help.question.module').then(m => m.HelpQuestionModule) },
          { path: 'permission', loadChildren: () => import('./modules/admin/sercurity/permission/permission.module').then(m => m.PermissionModule) },
          { path: 'emailtemplate', loadChildren: () => import('./modules/admin/email.template/email.template.module').then(m => m.EmailTemplateModule) },
          { path: 'brokerleadtemp', loadChildren: () => import('./modules/admin/broker.lead.temp/broker.lead.temp.module').then(m => m.BrokerLeadTempModule) },
          { path: 'crawrunhistory', loadChildren: () => import('./modules/admin/craw.run.history/craw.run.history.module').then(m => m.CrawRunHistoryModule) },
          { path: 'useractivity', loadChildren: () => import('./modules/admin/sercurity/user.activity/user.activity.module').then(m => m.UserActivityModule) },
          { path: 'consumptioncurve', loadChildren: () => import('./modules/admin/consumption.curve/consumption.curve.module').then(m => m.ConsumptionCurveModule) },
          { path: 'linkpermission', loadChildren: () => import('./modules/admin/sercurity/link.permission/link.permission.module').then(m => m.LinkPermissionModule) },
          { path: 'hubfilevalidation', loadChildren: () => import('./modules/admin/hubfile.validation/hubfile.validation.module').then(m => m.HubFileValidationModule) },
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
      { path: 'autosignin', loadChildren: () => import('./modules/admin/sercurity/auto.signin/auto.signin.module').then(m => m.AutoSignInModule) },
      { path: 'helpcenter', loadChildren: () => import('./modules/admin/help.center/help.center.module').then(m => m.HelpCenterModule) },
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
