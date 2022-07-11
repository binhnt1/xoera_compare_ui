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
    public service: AdminApiService,
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
    if (!this.authen.account?.IsAdmin) {
        this.loadNotYetAgreements();
    }
  }


  getState(outlet: any) {
    return outlet.activatedRouteData.state;
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
