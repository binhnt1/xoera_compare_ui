declare var require: any
import * as signalR from '@microsoft/signalr';
import { routerTransition } from "../app.animation";
import { UserIdleService } from "angular-user-idle";
import { AppConfig } from '../_core/helpers/app.config';
import { AuthService } from "../_core/services/auth.service";
import { DataService } from '../_core/services/data.service';
import { VersionService } from "../services/version.service";
import { ToastrHelper } from '../_core/helpers/toastr.helper';
import { DialogData } from '../_core/domains/data/dialog.data';
import { NotifyType } from '../_core/domains/enums/notify.type';
import { DialogService } from "../_core/services/dialog.service";
import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { NotifyEntity } from '../_core/domains/entities/notify.entity';

@Component({
  animations: [routerTransition],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './layout.component.html',
  styleUrls: [
    '../../assets/plugins/global/plugins.bundle.css', '../../assets/css/style.bundle.css',
    '../../assets/plugins/custom/datatables/datatables.bundle.css',
    '../../assets/css/skins/header/base/dark.css',
    '../../assets/css/skins/header/menu/dark.css',
    '../../assets/css/skins/brand/dark.css',
    '../../assets/css/skins/aside/dark.css',
    '../../assets/css/tooltip.css',
    '../../assets/css/grid.scss',
    '../../assets/css/app.scss',
    './layout.component.scss'
  ]
})
export class LayoutComponent implements OnInit {
  loading: boolean = true;
  dialogRestrict: DialogData;

  constructor(
    public data: DataService,
    public authen: AuthService,
    public dialog: DialogService,
    public userIdle: UserIdleService,
    public versionService: VersionService) {

  }

  async ngOnInit() {
    require('../../assets/plugins/custom/jstree/jstree.bundle.js');
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
    // sysend.on('notification', (type: string) => {
    //   if (type == 'new') {
    //     sysend.broadcast('notification', 'close');
    //     if (this.dialogRestrict)
    //       this.dialog.EventHideDialog.emit(this.dialogRestrict);
    //   } else {
    //     this.dialogRestrict = this.dialog.Alert('Hạn chế', 'Bạn đang sử dụng website ở trên một tab khác', true);
    //   }
    // });
    // sysend.broadcast('notification', 'new');
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
        }
      }
    });
  }

}
