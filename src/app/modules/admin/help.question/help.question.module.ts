import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { HelpQuestionEntity } from '../../../_core/domains/entities/question.entity';
import { EditHelpQuestionComponent } from './edit.help.question/edit.help.question.component';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class HelpQuestionComponent extends GridComponent {
    obj: GridData = {
        LastUpdatedBy: false,
        Size: ModalSizeType.Large,
        Reference: HelpQuestionEntity,
        Title: 'Help Question/Answer',
        CustomFilters: ['Type', 'Tags', 'Question']
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Type', Type: DataType.String },
            { Property: 'Question', Type: DataType.String },
            { Property: 'Tags', Type: DataType.String },          
        ];
        this.render(this.obj);
    }

    addNew() {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: this.obj.Title,
            confirmText: 'Add new',
            size: ModalSizeType.FullScreen,
            object: EditHelpQuestionComponent,
        }, () => this.loadItems());
    }

    edit(item: HelpQuestionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: this.obj.Title,
            confirmText: 'Save change',
            objectExtra: { id: item.Id },
            size: ModalSizeType.FullScreen,
            object: EditHelpQuestionComponent,
        }, () => this.loadItems());
    }

    view(item: HelpQuestionEntity) {
        this.dialogService.WapperAsync({
            cancelText: 'Close',
            title: this.obj.Title,
            size: ModalSizeType.FullScreen,
            object: EditHelpQuestionComponent,
            objectExtra: { id: item.Id, viewer: true },
        });
    } 
}

@NgModule({
    declarations: [
        HelpQuestionComponent,
        EditHelpQuestionComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: HelpQuestionComponent, pathMatch: 'full', data: { state: 'help-question' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class HelpQuestionModule { }