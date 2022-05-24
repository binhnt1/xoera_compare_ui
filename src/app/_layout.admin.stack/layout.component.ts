declare var require: any
import { routerTransition } from '../app.animation';
import { UserIdleService } from "angular-user-idle";
import { VersionService } from "../services/version.service";
import { DialogData } from '../_core/domains/data/dialog.data';
import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { AdminAuthService } from "../_core/services/admin.auth.service";
import { AdminDataService } from '../_core/services/admin.data.service';
import { AdminDialogService } from "../_core/services/admin.dialog.service";

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
    public data: AdminDataService,
    public authen: AdminAuthService,
    public userIdle: UserIdleService,
    public dialog: AdminDialogService,
    public versionService: VersionService) {

  }

  async ngOnInit() {
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
  }


  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
}
