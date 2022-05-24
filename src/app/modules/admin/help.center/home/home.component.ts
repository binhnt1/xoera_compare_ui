import * as _ from 'lodash';
import { Component } from '@angular/core';
import { HelpCenterService } from '../help.center.service';
import { QuestionDto } from '../../../../_core/domains/entities/question.entity';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HelpCenterHomeComponent {
  items: any[];
  constructor(public data: HelpCenterService) {
    this.data.breadcrumbs = [];
    this.items = _(this.data.questions)
      .groupBy((x: QuestionDto) => x.type)
      .map((value, key) => ({
        type: key,
        slug: value[0].slug,
        questions: value.slice(0, 5)
      }))
      .value();
  }

}
