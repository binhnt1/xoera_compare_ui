import { AppComponent } from './app.component';
import { Injector, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { UtilityModule } from './modules/utility.module';
import { BrowserModule } from '@angular/platform-browser';
import { VersionService } from './services/version.service';
import { LayoutAdminModule } from './_layout.admin/layout.module';
import { UserIdleModule, UserIdleService } from 'angular-user-idle';
import { AdminApiService } from './_core/services/admin.api.service';
import { AdminAuthService } from './_core/services/admin.auth.service';
import { AdminDataService } from './_core/services/admin.data.service';
import { AdminEventService } from './_core/services/admin.event.service';
import { RoleService } from './modules/admin/sercurity/role/role.service';
import { UserService } from './modules/admin/sercurity/user/user.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminDialogService } from './_core/services/admin.dialog.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminErrorInterceptor } from './_core/interceptor/admin.error.interceptor';

// client
import { LayoutModule } from './_layout/layout.module';
import { ApiService } from './_core/services/api.service';
import { AuthService } from './_core/services/auth.service';
import { DataService } from './_core/services/data.service';
import { EventService } from './_core/services/event.service';
import { DialogService } from './_core/services/dialog.service';
import { SiteService } from './modules/admin/site/site.service';
import { HubFileService } from './modules/admin/hubfile/hubfile.service';
import { ErrorInterceptor } from './_core/interceptor/error.interceptor';
import { LayoutAdminStackModule } from './_layout.admin.stack/layout.module';
import { BulkEmailService } from './modules/admin/bulk.email/bulk.email.service';
import { CrawWebsiteService } from './modules/admin/craw.website/craw.website.service';
import { CrawKeywordService } from './modules/admin/craw.keyword/craw.keyword.service';
import { EmailTemplateService } from './modules/admin/email.template/email.template.service';
import { CrawRunHistoryService } from './modules/admin/craw.run.history/craw.run.history.service';
import { BrokerLeadTempService } from './modules/admin/broker.lead.temp/broker.lead.temp.service';
import { BrokerService } from './modules/admin/broker/broker.service';
import { BrokerLeadService } from './modules/admin/broker.lead/broker.lead.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LayoutModule,
    UtilityModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutAdminModule,
    LayoutAdminStackModule,
    BrowserAnimationsModule,
    UserIdleModule.forRoot({ idle: 60000, timeout: 60, ping: 500 }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AdminErrorInterceptor,
      multi: true
    },    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },    
    ApiService,
    AuthService,
    DataService,
    UserService,
    RoleService,
    SiteService,
    EventService,
    BrokerService,
    DialogService,
    VersionService,
    HubFileService,
    UserIdleService,
    AdminApiService,
    AdminAuthService,
    AdminDataService,
    BulkEmailService,
    AdminEventService,
    BrokerLeadService,
    CrawKeywordService,
    CrawWebsiteService,
    AdminDialogService,
    EmailTemplateService,
    CrawRunHistoryService,
    BrokerLeadTempService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private injector: Injector) {
    AppInjector = this.injector;
  }
}
export let AppInjector: Injector;
