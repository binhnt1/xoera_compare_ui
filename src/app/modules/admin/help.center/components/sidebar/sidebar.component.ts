import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ActiveMenu, HelpCenterService } from '../../help.center.service';
import { QuestionDto } from '../../../../../_core/domains/entities/question.entity';

@Component({
  selector: 'help-center-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class HelpCenterSidebarComponent {
  items: any[] = [];

  constructor(
    public router: Router,
    public data: HelpCenterService) {
    if (this.data.questions) {
      this.data.questions.forEach((item: QuestionDto) => {
        this.items.push({
          type: item.type,
          slug: item.slug,
        });
        this.items = _.uniqBy(this.items, 'type');
      });
    }
  }

  search() {
    if (this.data.keyword)
      this.router.navigateByUrl('/helpcenter/search?query=' + this.data.keyword);
  }

  toggleActiveMenu(item: ActiveMenu) {
    item.active = !item.active;
  }
}
