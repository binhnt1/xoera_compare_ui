import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// modules
import { PipeModule } from '../_core/pipes/_pipe.module';
import { ModalModule } from '../_core/modal/modal.module';
import { EditorModule } from '../_core/editor/editor.module';
import { DirectiveModule } from '../_core/directives/_directive.module';
import { ComponentModule } from '../_core/components/component.module';

@NgModule({
    imports: [
        PipeModule,
        ModalModule,
        FormsModule,
        CommonModule,
        RouterModule,
        EditorModule,
        DirectiveModule,
        ComponentModule,
    ],
    exports: [
        PipeModule,
        ModalModule,
        FormsModule,
        CommonModule,
        RouterModule,
        EditorModule,
        DirectiveModule,
        ComponentModule,
    ]
})
export class UtilityModule { }
