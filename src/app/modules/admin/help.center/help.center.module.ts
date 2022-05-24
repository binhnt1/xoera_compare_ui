
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UtilityModule } from "../../utility.module";
import { HelpCenterService } from "./help.center.service";
import { HelpCenterComponent } from "./help.center.component";
import { HelpCenterHomeComponent } from "./home/home.component";
import { HelpCenterSearchComponent } from "./search/search.component";
import { HelpCenterQuestionComponent } from "./question/question.component";
import { HelpCenterHeaderComponent } from "./components/header/header.component";
import { HelpCenterSidebarComponent } from "./components/sidebar/sidebar.component";
import { HelpCenterBreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";

@NgModule({
    declarations: [
        HelpCenterComponent,
        HelpCenterHomeComponent,
        HelpCenterSearchComponent,
        HelpCenterHeaderComponent,
        HelpCenterSidebarComponent,
        HelpCenterQuestionComponent,
        HelpCenterBreadcrumbComponent
    ],
    imports: [
        UtilityModule,
        RouterModule.forChild([
            {
                path: '',
                component: HelpCenterComponent,
                children: [
                    { path: 'question', component: HelpCenterQuestionComponent, pathMatch: 'full', data: { state: 'help-center-question' } },
                    { path: 'search', component: HelpCenterSearchComponent, pathMatch: 'full', data: { state: 'help-center-search' } },
                    { path: '', component: HelpCenterHomeComponent, pathMatch: 'full', data: { state: 'help-center-home' } },
                ]
            }
        ])
    ],
    providers: [
        HelpCenterService,
    ]
})
export class HelpCenterModule { }