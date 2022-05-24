import { Component } from '@angular/core';
import { HelpCenterService } from '../../help.center.service';

@Component({
  selector: 'help-center-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class HelpCenterBreadcrumbComponent {
  constructor(public data: HelpCenterService) {

  }
}
