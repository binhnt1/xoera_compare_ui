import { Component, Input } from "@angular/core";
import { ActionData } from "../../../../_core/domains/data/action.data";
import { ButtonType } from "../../../../_core/domains/enums/button.type";
import { BreadcrumbData } from "../../../../_core/domains/data/breadcrumb.data";

@Component({
    selector: 'edit-header-view',
    styleUrls: ['./edit.header.view.component.scss'],
    templateUrl: "./edit.header.view.component.html"
})
export class EditHeaderViewComponent {
    ButtonType = ButtonType;
    @Input() actions: ActionData[];
    @Input() breadcrumbs: BreadcrumbData[];

    constructor() {
    }
}
