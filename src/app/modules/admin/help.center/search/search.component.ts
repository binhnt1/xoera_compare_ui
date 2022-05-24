import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpCenterService } from '../help.center.service';
import { QuestionDto } from '../../../../_core/domains/entities/question.entity';

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class HelpCenterSearchComponent {

  title: string;
  category: string;
  countResult: number;
  items: QuestionDto[];

  constructor(
    public route: ActivatedRoute,
    public data: HelpCenterService) {
    this.data.breadcrumbs = ['Search'];
    this.route.queryParams.subscribe(params => {
      this.category = params['query'];
      this.title = this.category;
      this.countResult = 0;
      if (this.category && this.data.questions) {
        this.items = this.data.questions.filter(c => c.question.toLowerCase().indexOf(this.category.toLowerCase()) >= 0);
        if (this.items && this.items.length > 0) {
          this.items.forEach((item: QuestionDto) => {
            item.collapsed = true;
          });
          this.countResult = this.items.length;
          this.data.breadcrumbs = ['Search', this.title];
        }
        this.data.keyword = this.category;
      }
    });
  }

  toggleItem(item: QuestionDto) {
    item.collapsed = !item.collapsed;
  }

}
