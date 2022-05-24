import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PipeModule } from '../pipes/_pipe.module';
import { ChatComponent } from './chat/chat.component';
import { EditorModule } from '../editor/editor.module';
import { PagingComponent } from './paging/paging.component';
import { LoadingComponent } from './loading/loading.component';
import { DirectiveModule } from '../directives/_directive.module';
import { DropdownComponent } from './dropdown/dropdown.component';
import { HistoryComponent } from './edit/history/history.component';
import { EditHeaderComponent } from './edit/header/edit.header.component';
import { GridEditPopupComponent } from './grid/edit.popup/edit.popup.component';
import { EditHeaderViewComponent } from './edit/header.view/edit.header.view.component';

@NgModule({
    imports: [
        PipeModule,
        FormsModule,
        CommonModule,
        RouterModule,
        EditorModule,
        DirectiveModule
    ],
    declarations: [
        ChatComponent,
        PagingComponent,
        LoadingComponent,
        HistoryComponent,
        DropdownComponent,
        EditHeaderComponent,
        GridEditPopupComponent,
        EditHeaderViewComponent
    ],
    exports: [
        ChatComponent,
        PagingComponent,
        LoadingComponent,
        HistoryComponent,
        DropdownComponent,
        EditHeaderComponent,
        GridEditPopupComponent,
        EditHeaderViewComponent
    ]
})
export class ComponentModule { }
