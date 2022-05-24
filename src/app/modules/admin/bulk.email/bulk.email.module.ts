import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../../utility.module";
import { AdminShareModule } from "../admin.share.module";
import { SentItemComponent } from "./sent.item/sent.item.component";
import { EmailLogComponent } from "./email.log/email.log.component";
import { AdminAuthGuard } from "../../../_core/guards/admin.auth.guard";
import { SendEmailComponent } from "./send.email/send.email.component";
import { ListContactComponent } from "./components/list.contact.compnent";

@NgModule({
    declarations: [
        SentItemComponent,
        EmailLogComponent,
        SendEmailComponent,
        ListContactComponent
    ],
    imports: [
        UtilityModule,
        AdminShareModule,
        RouterModule.forChild([
            { path: '', component: SendEmailComponent, pathMatch: 'full', data: { state: 'sendemail' }, canActivate: [AdminAuthGuard] },
            { path: 'sentitem', component: SentItemComponent, pathMatch: 'full', data: { state: 'sendemail_sentitem' }, canActivate: [AdminAuthGuard] },
            { path: 'emaillog', component: EmailLogComponent, pathMatch: 'full', data: { state: 'sendemail_emaillog' }, canActivate: [AdminAuthGuard] },
        ])
    ]
})
export class BulkEmailModule { }