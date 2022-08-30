declare var require: any
import { routerTransition } from '../app.animation';
import { UserIdleService } from "angular-user-idle";
import { VersionService } from "../services/version.service";
import { ResultApi } from '../_core/domains/data/result.api';
import { DialogData } from '../_core/domains/data/dialog.data';
import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { AdminApiService } from '../_core/services/admin.api.service';
import { ModalSizeType } from '../_core/domains/enums/modal.size.type';
import { AdminAuthService } from "../_core/services/admin.auth.service";
import { AdminDataService } from '../_core/services/admin.data.service';
import { AdminDialogService } from "../_core/services/admin.dialog.service";
import { AgreementEntity } from '../_core/domains/entities/agreement.entity';
import { AcceptAgreementComponent } from '../_core/components/accept.agreement/accept.agreement.component';
import { Router } from '@angular/router';
import { AdminUserLoginDto } from '../_core/domains/objects/user.dto';
import { UserActivityHelper } from '../_core/helpers/user.activity.helper';
import { ResultType } from '../_core/domains/enums/result.type';
import { ToastrHelper } from '../_core/helpers/toastr.helper';
import { AppConfig } from '../_core/helpers/app.config';
import * as signalR from '@microsoft/signalr';
import { NotifyEntity } from '../_core/domains/entities/notify.entity';
import { NotifyType } from '../_core/domains/enums/notify.type';
import { AdminEventService } from '../_core/services/admin.event.service';

@Component({
  animations: [routerTransition],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './layout.component.html',
  styleUrls: [
    '../../assets/plugins/bootstrap-phone/build/css/intlTelInput.css',
    '../../assets/plugins/custom/datatables/datatables.bundle.css',
    '../../assets/plugins/custom/jstree/jstree.bundle.css',
    '../../assets/plugins/datetime/css/datepicker.css',
    '../../assets/plugins/tagify/dist/tagify.css',
    '../../app-assets/css/input.scss',
    '../../assets/css/tooltip.css',
    '../../assets/css/grid.scss',
    '../../assets/css/app.scss',
    './layout.component.scss'
  ]
})
export class LayoutAdminStackComponent implements OnInit {
  loading: boolean = true;
  dialogRestrict: DialogData;

  constructor(
    public router: Router,
    public data: AdminDataService,
    public event: AdminEventService,
    public service: AdminApiService,
    public authen: AdminAuthService,
    public userIdle: UserIdleService,
    public dialog: AdminDialogService,
    public versionService: VersionService) {

  }

  async ngOnInit() {
    let queryParams = this.router.parseUrl(this.router.url).queryParams,
      username: string = queryParams && queryParams['username'],
      password: string = queryParams && queryParams['password'];
    if (username && password) {
      this.loading = true;
      let obj: AdminUserLoginDto = {
        UserName: username,
        Password: UserActivityHelper.CreateHash256(password)
      };
      this.service.adminSignin(obj).then(async (result: ResultApi) => {
        if (result && result.Type == ResultType.Success) {
          await this.authen.login(result.Object, true);
        } else ToastrHelper.ErrorResult(result);
        this.router.navigateByUrl('admin/signin');
        this.loading = false;
      }, (ex: any) => {
        this.loading = false;
        ToastrHelper.Exception(ex);
        this.router.navigateByUrl('admin/signin');
      });
    } else {
      await this.data.loadCountryIp();
      this.loading = false;
      setTimeout(() => {
        let url = window.location.href;
        if (url.indexOf('localhost') < 0) {
          this.versionService.initVersionCheck('version.json', 60000, (version: string) => {
            this.dialog.ConfirmAsync('Already have a new version, would you like to update? <p> Version: <b>' + version + '</b></p>', async () => {
              (<any>location).reload(true);
            });
          });
        }
      }, 1000);
      if (!this.authen.account?.IsAdmin) {
        this.loadNotYetAgreements();
      }
    }

    if (this.authen.account) this.signlar();
  }


  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }

  private play() {
    try {
      var audio = new Audio();
      audio.src = './assets/soundfiles/all-eyes-on-me.mp3';
      audio.load();
      audio.play();
    }
    catch { }
  }
  private signlar() {
    // Signlar
    let email = this.authen.account.Email;
    let signlarUrl = AppConfig.SignalrUrl + '?email=' + email;
    this.data.connection = new signalR.HubConnectionBuilder()
      .withUrl(signlarUrl)
      .withAutomaticReconnect()
      .build();
    this.data.connection.start().then(() => {
      console.log('connected');
    }).catch((err: any) => {
      console.error(err);
      setTimeout(() => {
        if (this.data.connection)
          this.data.connection.start();
      }, 2000);
    });
    this.data.connection.onclose(() => {
      console.log('disconected');
    });
    this.data.connection.on('notify', (notify: NotifyEntity) => {
      this.play();
      if (notify) {
        if (notify.Title) ToastrHelper.Success(notify.Title);
        switch (notify.Type) {
          case NotifyType.LockUser: {
            this.authen.logout(false);
            this.dialog.AlertTimeOut('Message', '<p>' + notify.Title + '</p><br /><p>' + notify.Content + '</p><br /><p>The system will log out after <b> 10 seconds </b>', 10, true);
            setTimeout(() => {
              this.authen.logout();
            }, 10000);
          }
            break;
          case NotifyType.UpdateRole: {
            this.authen.logout(false);
            this.dialog.AlertTimeOut('Message', '<p>' + notify.Title + '</p><br /><p>The system will log out after <b> 10 seconds </b>', 10, true);
            setTimeout(() => {
              this.authen.logout();
            }, 10000);
          }
            break;
          case NotifyType.ChangePassword: {
            this.authen.logout(false);
            this.dialog.AlertTimeOut('Message', '<p>' + notify.Title + '</p><br /><p>' + notify.Content + '</p><br /><p>The system will log out after <b> 10 seconds </b>', 10, true);
            setTimeout(() => {
              this.authen.logout();
            }, 10000);
          }
            break;
          case NotifyType.JobExpried:
            case NotifyType.JobBidding:
          case NotifyType.JobAccepted:
          case NotifyType.JobPublished: {
            this.event.RefreshGrids.emit(notify);
          }
            break;
        }
      }
    });
  }
  private loadNotYetAgreements() {
    this.service.callApi('UserAgreement', 'NotYetAgreements').then((result: ResultApi) => {
      if (ResultApi.IsSuccess(result)) {
        let items: AgreementEntity[] = result.Object;
        if (items && items.length > 0) {
          this.dialog.WapperAsync({
            restrict: true,
            cancelText: '',
            confirmText: '',
            title: 'Agreement',
            size: ModalSizeType.ExtraLarge,
            object: AcceptAgreementComponent,
            objectExtra: {
              items: items
            }
          });
        }
      }
    })
  }
}
