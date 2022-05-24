import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpCenterService } from '../help.center.service';
import { QuestionDto } from '../../../../_core/domains/entities/question.entity';

@Component({
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class HelpCenterQuestionComponent {
  index: number;
  title: string;
  category: string;
  items: QuestionDto[];

  constructor(
    public route: ActivatedRoute,
    public data: HelpCenterService) {
    this.data.breadcrumbs = ['Generic FAQs'];
    this.route.queryParams.subscribe(params => {
      this.category = params['category'];
      this.index = params['index'] ? parseInt(params['index']) : 0;
      if (this.category) {
        this.items = this.data.questions.filter(c => c.slug == this.category);
        if (this.items && this.items.length > 0) {
          this.title = this.items[0].type;
          this.items.forEach((item: QuestionDto, index: number) => {
            item.collapsed = true;
            if (this.index >= 0 && index == this.index) {
              item.collapsed = false;
            }
          });
          this.data.breadcrumbs = ['Generic FAQs', this.title];
        }
      }
    });
  }

  toggleItem(item: QuestionDto) {
    item.collapsed = !item.collapsed;
  }
}
