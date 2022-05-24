import { Subscription } from "rxjs/internal/Subscription";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ButtonType } from "../../../../_core/domains/enums/button.type";
import { ObjectEx } from "../../../../_core/decorators/object.decorator";
import { MoreActionData } from "../../../../_core/domains/data/grid.data";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { BreadcrumbData } from "../../../../_core/domains/data/breadcrumb.data";
import { AdminEventService } from "../../../../_core/services/admin.event.service";

@Component({
    selector: 'edit-header',
    styleUrls: ['./edit.header.component.scss'],
    templateUrl: "./edit.header.component.html"
})
export class EditHeaderComponent implements OnInit {
    errors: string[];
    ButtonType = ButtonType;
    subscribeValidation: Subscription;

    @Input() fixed: boolean;
    @Input() button: ActionData;
    @Input() processing: boolean;
    @Input() actions: ActionData[];
    @Input() moreActions: MoreActionData;
    @Input() breadcrumbs: BreadcrumbData[];

    constructor(
        public ref: ChangeDetectorRef,
        public event: AdminEventService) {
    }

    ngOnInit() {
        if (!this.button && this.actions)
            this.button = this.actions.find(c => c.processButton);
        this.errors = null;
        if (!this.subscribeValidation) {
            this.subscribeValidation = this.event.Validate.subscribe((item: ObjectEx) => {
                if (item.error) {
                    if (!this.errors) this.errors = [];
                    this.errors.push(item.error);
                    setTimeout(() => {
                        this.errors = [];
                    }, 30000)
                }
            })
        }

        this.event.ResetValidate.subscribe((item: ObjectEx) => {            
            this.errors = [];
        })
    }

    ngOnChanges() {
        this.ref.detectChanges();
        if (this.actions)
            this.button = this.actions.find(c => c.processButton);
    }

    hideMessage() {
        this.errors = null;
    }

    buttonClick(item: any) {
        this.errors = null;
        if (this.button && this.button.click)
            this.button.click();
    }
}
