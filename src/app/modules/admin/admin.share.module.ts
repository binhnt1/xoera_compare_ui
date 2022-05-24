import { NgModule } from '@angular/core';
import { UtilityModule } from './../utility.module';
import { ViewRoleComponent } from './sercurity/role/view.role/view.role.component';
import { EditRoleComponent } from './sercurity/role/edit.role/edit.role.component';
import { ViewUserComponent } from './sercurity/user/view.user/view.user.component';
import { ChoiceUserComponent } from './sercurity/user/choice.user/choice.user.component';
import { ViewChoiceUserComponent } from './sercurity/user/choice.user/view.choice.user.component';
import { EditRolePermissionComponent } from './sercurity/role/edit.permission/edit.permission.component';

@NgModule({
    imports: [
        UtilityModule
    ],
    declarations: [
        ViewRoleComponent,
        EditRoleComponent,
        ViewUserComponent,
        ChoiceUserComponent,
        ViewChoiceUserComponent,  
        EditRolePermissionComponent,
    ],
    exports: [
        ViewRoleComponent,
        EditRoleComponent,
        ViewUserComponent,
        ChoiceUserComponent,
        ViewChoiceUserComponent,   
        EditRolePermissionComponent,
    ]
})
export class AdminShareModule { }
