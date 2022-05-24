import { RouterModule } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { UtilityModule } from '../../utility.module';
import { GridData } from '../../../_core/domains/data/grid.data';
import { DataType } from '../../../_core/domains/enums/data.type';
import { ListUserComponent } from './list.user/list.user.component';
import { AdminAuthGuard } from '../../../_core/guards/admin.auth.guard';
import { EditNoticeComponent } from './edit.notice/edit.noticecomponent';
import { NoticeEntity } from '../../../_core/domains/entities/notice.entity';
import { ModalSizeType } from '../../../_core/domains/enums/modal.size.type';
import { GridComponent } from '../../../_core/components/grid/grid.component';
import { NavigationStateData } from '../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: '../../../_core/components/grid/grid.component.html',
})
export class NoticeComponent extends GridComponent {
    obj: GridData = {
        Imports: [],
        Exports: [],
        LastUpdatedBy: false,
        Reference: NoticeEntity,
        Size: ModalSizeType.Large,
    };

    constructor() {
        super();
        this.properties = [
            { Property: 'Id', Type: DataType.Number },
            { Property: 'Subject', Type: DataType.String },
            { Property: 'MustAgree', Type: DataType.Boolean, Align: 'center' }
        ];
        this.render(this.obj);
    }

    addNew() {
        let obj: NavigationStateData = {
            prevData: this.itemData,
            prevUrl: '/admin/notice',
        };
        this.router.navigate(['/admin/notice/add'], { state: { params: JSON.stringify(obj) } });
    }

    edit(item: NoticeEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevData: this.itemData,
            prevUrl: '/admin/notice',
        };
        this.router.navigate(['/admin/notice/edit'], { state: { params: JSON.stringify(obj) } });
    }

    view(item: NoticeEntity) {
        let obj: NavigationStateData = {
            id: item.Id,
            viewer: true,
            prevData: this.itemData,
            prevUrl: '/admin/notice',
        };
        this.router.navigate(['/admin/notice/view'], { state: { params: JSON.stringify(obj) } });
    }
}

@NgModule({
    declarations: [
        NoticeComponent, 
        ListUserComponent,
        EditNoticeComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            { path: '', component: NoticeComponent, pathMatch: 'full', data: { state: 'ccl' }, canActivate: [AdminAuthGuard] },            
            { path: 'add', component: EditNoticeComponent, pathMatch: 'full', data: { state: 'add_notice'}, canActivate: [AdminAuthGuard] },
            { path: 'edit', component: EditNoticeComponent, pathMatch: 'full', data: { state: 'edit_notice'}, canActivate: [AdminAuthGuard] },
            { path: 'view', component: EditNoticeComponent, pathMatch: 'full', data: { state: 'view_notice'}, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class NoticeModule { }