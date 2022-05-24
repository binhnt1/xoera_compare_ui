import * as _ from 'lodash';
import { ResultApi } from '../domains/data/result.api';
import { Injectable, EventEmitter } from '@angular/core';
import { DialogData } from '../domains/data/dialog.data';
import { DialogType } from '../domains/enums/dialog.type';

@Injectable()
export class AdminDialogService {
    private wapperDialog: DialogData;
    public EventDialog: EventEmitter<any> = new EventEmitter<any>();
    public EventHideDialog: EventEmitter<any> = new EventEmitter<any>();
    public EventHideAllDialog: EventEmitter<any> = new EventEmitter<any>();
    
    public HideAllDialog() {
        this.EventHideAllDialog.emit();
    }
    public Dialog(dialog: DialogData) {
        this.EventDialog.emit(dialog);
    }    
    public ErrorResult(result: ResultApi) {
        this.Alert("Error", result.Description);
    }
    public HideDialog(diaglog: DialogData) {
        this.EventHideDialog.emit(diaglog);
    }
    public Error(content: string, title: string = 'Error') {
        this.Alert(title, content);
    }
    public Alert(title: string, content: string, restrict: boolean = false): DialogData {
        let dialog: DialogData = {
            title: title,
            content: content,
            okFunction: null,
            restrict: restrict,
            cancelFunction: null,
            type: DialogType.Alert,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public AlertTimeOut(title: string, content: string, timeout: number, restrict: boolean = false): DialogData {
        let dialog: DialogData = {
            title: title,
            object: timeout,
            content: content,
            okFunction: null,
            restrict: restrict,
            cancelFunction: null,
            type: DialogType.AlertTimer,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public Loading(title: string, content: string): DialogData {
        let dialog: DialogData = {
            title: title,
            restrict: true,
            content: content,
            okFunction: null,
            cancelFunction: null,
            type: DialogType.Loading,
        };
        this.EventDialog.emit(dialog);
        return dialog;
    }
    public Success(content: string, title: string = 'Success') {
        this.Alert(title, content);
    }    
    public Warning(content: string, title: string = 'Warning') {
        this.Alert(title, content);
    }   
    public Timeout(userIdle: any, okFunction: () => void = null, title = 'Lock screen') {
        let dialog: DialogData = {
            title: title,
            restrict: true,
            object: userIdle,
            content: 'content',
            cancelFunction: null,
            type: DialogType.Timeout,
            okFunction: () => {
                if (okFunction) okFunction();
            },
        };
        this.EventDialog.emit(dialog);
    }
    public WapperAsync(obj: DialogData, 
        okFunction?: (obj?: any) => Promise<any>, 
        rejectFunction?: () => Promise<any>, 
        resultFunction?: () => Promise<any>, 
        cancelFunction: () => void = null) {
        if (this.wapperDialog) this.HideDialog(this.wapperDialog);
        if (!obj.cancelText) obj.cancelText = 'Close';
        this.wapperDialog = {
            size: obj.size,
            title: obj.title,
            object: obj.object,
            type: DialogType.Wrapper,
            cancelText: obj.cancelText,
            rejectText: obj.rejectText,
            resultText: obj.resultText,
            objectExtra: obj.objectExtra,
            confirmText: obj.confirmText,
            okFunctionAsync: async (obj?: any) => {
                if (okFunction) await okFunction(obj);
            },
            cancelFunction: () => {
                if (cancelFunction) cancelFunction();
            },
            rejectFunctionAsync: async () => {
                if (rejectFunction) await rejectFunction();
            },
            resultFunctionAsync: async () => {
                if (resultFunction) await resultFunction();
            }
        }
        this.EventDialog.emit(this.wapperDialog);
    }
    public Confirm(content: string, okFunction: () => void, cancelFunction: () => void = null, title = 'Confirm') {
        let dialog: DialogData = {
            title: title,
            content: content,
            cancelText: 'Cancel',
            confirmText: 'Confirm',
            type: DialogType.Confirm,
            cancelFunction: () => {
                if (cancelFunction) cancelFunction();
            },
            okFunction: () => {
                if (okFunction) okFunction();
            }
        }
        this.EventDialog.emit(dialog);
    }
    public ConfirmAsync(content: string, okFunction: () => Promise<any>, cancelFunction: () => void = null, title = 'Confirm') {
        let dialog: DialogData = {
            title: title,
            content: content,            
            cancelText: 'Cancel',
            confirmText: 'Confirm',
            cancelFunction: () => {
                if (cancelFunction) cancelFunction();
            },
            type: DialogType.Confirm,
            okFunctionAsync: async () => {
                if (okFunction) await okFunction();
            }
        }
        this.EventDialog.emit(dialog);
    }
}