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
          { path: 'job', loadChildren: () => import('./modules/admin/job/job.module').then(m => m.JobModule) },
          { path: 'zone', loadChildren: () => import('./modules/admin/zone/zone.module').then(m => m.ZoneModule) },
          { path: 'price', loadChildren: () => import('./modules/admin/price/price.module').then(m => m.PriceModule) },
          { path: 'error', loadChildren: () => import('./_core/modules/error/error.module').then(m => m.ErrorModule) },
          { path: 'tariff', loadChildren: () => import('./modules/admin/tariff/tariff.module').then(m => m.TariffModule) },
          { path: 'user', loadChildren: () => import('./modules/admin/sercurity/user/user.module').then(m => m.UserModule) },
          { path: 'role', loadChildren: () => import('./modules/admin/sercurity/role/role.module').then(m => m.RoleModule) },
          { path: 'licence', loadChildren: () => import('./modules/admin/licence/licence.module').then(m => m.LicenceModule) },
          { path: 'account', loadChildren: () => import('./modules/admin/account/account.module').then(m => m.AccountModule) },
          { path: 'company', loadChildren: () => import('./modules/admin/company/company.module').then(m => m.CompanyModule) },
          { path: 'customer', loadChildren: () => import('./modules/admin/customer/customer.module').then(m => m.CustomerModule) },
          { path: 'parameter', loadChildren: () => import('./modules/admin/parameter/parameter.module').then(m => m.ParameterModule) },
          { path: 'agreement', loadChildren: () => import('./modules/admin/agreement/agreement.module').then(m => m.AgreementModule) },
          { path: 'pricehike', loadChildren: () => import('./modules/admin/price.hike/price.hike.module').then(m => m.PriceHikeModule) },
          { path: 'pricerule', loadChildren: () => import('./modules/admin/price.rule/price.rule.module').then(m => m.PriceRuleModule) },
          { path: 'fixedprice', loadChildren: () => import('./modules/admin/fixed.price/fixed.price.module').then(m => m.FixedPriceModule) },
          { path: 'smtpaccount', loadChildren: () => import('./modules/admin/smtp.account/smtp.account.module').then(m => m.SmtpAccountModule) },
          { path: 'vehicletype', loadChildren: () => import('./modules/admin/vehicle.type/vehicle.type.module').then(m => m.VehicleTypeModule) },
          { path: 'permission', loadChildren: () => import('./modules/admin/sercurity/permission/permission.module').then(m => m.PermissionModule) },
          { path: 'configuration', loadChildren: () => import('./modules/admin/configuration/configuration.module').then(m => m.ConfigurationModule) },
          { path: 'useragreement', loadChildren: () => import('./modules/admin/user.agreement/user.agreement.module').then(m => m.UserAgreementModule) },
          { path: 'emailtemplate', loadChildren: () => import('./modules/admin/email.template/email.template.module').then(m => m.EmailTemplateModule) },
          { path: 'companypartner', loadChildren: () => import('./modules/admin/company.partner/company.partner.module').then(m => m.CompanyPartnerModule) },
          { path: 'useractivity', loadChildren: () => import('./modules/admin/sercurity/user.activity/user.activity.module').then(m => m.UserActivityModule) },
          { path: 'dispatchinvoice', loadChildren: () => import('./modules/admin/dispatch.invoice/dispatch.invoice.module').then(m => m.DispatchInvoiceModule) },
          { path: 'linkpermission', loadChildren: () => import('./modules/admin/sercurity/link.permission/link.permission.module').then(m => m.LinkPermissionModule) },
          { path: 'vehicletypemapping', loadChildren: () => import('./modules/admin/vehicle.type.mapping/vehicle.type.mapping.module').then(m => m.VehicleTypeMappingModule) },
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
