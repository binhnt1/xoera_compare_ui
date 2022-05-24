import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilityModule } from '../../../utility.module';
import { AutoSignInComponent } from './auto.signin.component';

@NgModule({
    declarations: [
        AutoSignInComponent,
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([           
            { path: '', component: AutoSignInComponent, pathMatch: 'full', data: { state: 'auto_signin'} },
        ])
    ]
})
export class AutoSignInModule { }
