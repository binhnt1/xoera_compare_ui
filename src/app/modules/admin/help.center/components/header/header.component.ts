import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HelpCenterService } from '../../help.center.service';
import { AdminAuthService } from '../../../../../_core/services/admin.auth.service';

@Component({
  selector: 'help-center-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HelpCenterHeaderComponent {
  constructor(
    public router: Router,
    public data: HelpCenterService,
    public authen: AdminAuthService) {
  }

  search() {
    if (this.data.keyword)
      this.router.navigateByUrl('/helpcenter/search?query=' + this.data.keyword);
  }
}
