import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerifyComponent } from './verify.component';
import { UtilityModule } from '../../../utility.module';

@NgModule({
    declarations: [
        VerifyComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([           
            { path: '', component: VerifyComponent, pathMatch: 'full', data: { state: 'verify'} },
        ])
    ]
})
export class VerifyModule { }
