import { NgModule } from '@angular/core';
import { UtilityModule } from './../utility.module';
import { ViewRoleComponent } from './sercurity/role/view.role/view.role.component';
import { EditRoleComponent } from './sercurity/role/edit.role/edit.role.component';
import { ViewUserComponent } from './sercurity/user/view.user/view.user.component';
import { ChoiceUserComponent } from './sercurity/user/choice.user/choice.user.component';
import { HubFileTreeComponent } from './hubfile/components/hubfile.tree/hubfile.tree.component';
import { ViewChoiceUserComponent } from './sercurity/user/choice.user/view.choice.user.component';
import { EditRolePermissionComponent } from './sercurity/role/edit.permission/edit.permission.component';
import { EditBrokerLeadComponent } from './broker.lead.temp/create.broker.lead/create.broker.lead.component';
import { HubFileTreeChildComponent } from './hubfile/components/hubfile.tree/hubfile.tree.child/hubfile.tree.child.component';

@NgModule({
    imports: [
        UtilityModule
    ],
    declarations: [
        ViewRoleComponent,
        EditRoleComponent,
        ViewUserComponent,
        ChoiceUserComponent,
        HubFileTreeComponent,
        ViewChoiceUserComponent,  
        EditBrokerLeadComponent, 
        HubFileTreeChildComponent,
        EditRolePermissionComponent,
    ],
    exports: [
        ViewRoleComponent,
        EditRoleComponent,
        ViewUserComponent,
        ChoiceUserComponent,
        HubFileTreeComponent,
        ViewChoiceUserComponent,   
        EditBrokerLeadComponent, 
        HubFileTreeChildComponent, 
        EditRolePermissionComponent,
    ]
})
export class AdminShareModule { }
