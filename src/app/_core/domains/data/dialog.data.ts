import { DialogType } from "../enums/dialog.type";
import { ModalSizeType } from "../enums/modal.size.type";

export class DialogData {
    object?: any;
    title?: string;
    content?: string;
    type?: DialogType;
    objectExtra?: any;
    restrict?: boolean;
    cancelText?: string;
    rejectText?: string;
    resultText?: string;
    size?: ModalSizeType;
    confirmText?: string;
    cancelFunction?: () => void;
    okFunction?: (result?: any) => void;
    resultFunction?: (result?: any) => void;
    rejectFunction?: (result?: any) => void;
    okFunctionAsync?: (result?: any) => Promise<any>;
    rejectFunctionAsync?: (result?: any) => Promise<any>;
    resultFunctionAsync?: (result?: any) => Promise<any>;

    constructor() {        
    }
}