import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

// modules
import { PipeModule } from '../_core/pipes/_pipe.module';
import { ModalModule } from '../_core/modal/modal.module';
import { DirectiveModule } from '../_core/directives/_directive.module';

// layout
import { LayoutComponent } from './layout.component';
import { ComponentModule } from '../_core/components/component.module';
import { LayoutSignInComponent } from './signin/layout.signin.component';
import { LayoutAsideComponent } from './components/aside/aside.component';
import { LayoutHeaderComponent } from './components/header/header.component';
import { LayoutFooterComponent } from './components/footer/footer.component';
import { LayoutHeaderMobileComponent } from './components/header.mobile/header.mobile.component';

@NgModule({
    imports: [
        PipeModule,
        FormsModule,
        ModalModule,
        CommonModule,
        RouterModule,
        BrowserModule,
        ComponentModule,
        DirectiveModule,
    ],
    declarations: [
        LayoutComponent,
        LayoutAsideComponent,
        LayoutHeaderComponent,
        LayoutFooterComponent,
        LayoutSignInComponent,
        LayoutHeaderMobileComponent,
    ],
    exports: [
        LayoutComponent,
        LayoutAsideComponent,
        LayoutHeaderComponent,
        LayoutFooterComponent,
        LayoutSignInComponent,
        LayoutHeaderMobileComponent,
    ]
})
export class LayoutModule { }
