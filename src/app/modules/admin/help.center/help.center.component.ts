import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpCenterService } from './help.center.service';
import { QuestionDto } from '../../../_core/domains/entities/question.entity';

@Component({
    templateUrl: './help.center.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        '../../../../help-assets/styles/font.awesome.css',
        '../../../../help-assets/styles/style.css',
        '../../../../help-assets/styles/style1.css',
        '../../../../help-assets/styles/responsive.css',
        './help.center.component.scss'
    ]
})
export class HelpCenterComponent implements OnInit {
    loading: boolean = true;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public data: HelpCenterService) {
    }

    async ngOnInit() {
        this.data.questions = await this.data.getQuestions();
        this.data.questions.forEach((item: QuestionDto) => {
            item.slug = item.type.toLowerCase();
            while (item.slug.indexOf(' ') >= 0)
                item.slug = item.slug.replace(' ', '_');
        });
        this.loading = false;
    }
}
