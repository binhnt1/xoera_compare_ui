import { ResultApi } from "./result.api";
import { FileType } from "../enums/file.type";

export class UploadData {
    data: any;
    path?: string;
    type?: FileType;
    failFunction?: (evt: any) => void;
    cancelFunction?: (evt: any) => void;
    processFunction?: (percent: number) => void;
    completeFunction?: (result: ResultApi) => void;

    constructor() {     
        this.type = FileType.Image;   
    }
}
