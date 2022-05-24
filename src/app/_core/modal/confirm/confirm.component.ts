import { Subscription } from 'rxjs';
import { DialogData } from '../../domains/data/dialog.data';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogType } from '../../domains/enums/dialog.type';
import { AdminDialogService } from '../../services/admin.dialog.service';

@Component({
    selector: 'modal-confirm',
    templateUrl: 'confirm.component.html',
    styleUrls: ['../../../../assets/css/modal.scss'],
})
export class ModalConfirmComponent implements OnInit, OnDestroy {
    dialog: DialogData;
    processing: boolean;
    visible: boolean = false;
    eventDialog: Subscription = null;

    constructor(public dialogService: AdminDialogService) { }

    ngOnInit() {
        if (this.eventDialog == null) {
            this.eventDialog = this.dialogService.EventDialog.subscribe((item: DialogData) => {
                if (item.type == DialogType.Confirm) {
                    this.dialog = item;
                    this.visible = true;
                }
            });
        }
        this.dialogService.EventHideDialog.subscribe((item: DialogData) => {
            if (item.type == DialogType.Confirm) {
                this.visible = false;
            }
        });
    }

    ngOnDestroy() {
        if (this.eventDialog != null) {
            this.eventDialog.unsubscribe();
            this.eventDialog = null;
            this.visible = false;
        }
    }

    public closeModal() {
        if (this.dialog) {
            this.visible = false;
            if (this.dialog.cancelFunction)
                this.dialog.cancelFunction();
        }
    }

    public async confirmModal() {
        if (this.dialog) {
            this.processing = true;
            if (this.dialog.okFunction)
                this.dialog.okFunction();
            else if (this.dialog.okFunctionAsync)
                await this.dialog.okFunctionAsync();
            this.processing = false;
            this.visible = false;
            this.dialog = null;
        }
    }
}
