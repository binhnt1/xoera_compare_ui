import { MessageHelper } from "./message.helper";
import { ResultApi } from "../domains/data/result.api";

declare var toastr: any;
export class ToastrHelper {
    public static Exception(ex: any, title: string = 'Exception', timeout: number = 10000, onclick: any = null) {
        console.log(ex);
        let description = MessageHelper.SystemWrong;
        if (ex && ex.error) {
            if (typeof ex.error == 'string')
                description = ex.error;
            else if (ex.error && ex.error.error)
                description = ex.error.error;
        }
        toastr.options = { timeOut: timeout, onclick: onclick };
        if (description) toastr.error(description, title);
    }
    public static Error(message: string, title: string = 'Error', timeout: number = 10000, onclick: any = null) {
        toastr.options = { timeOut: timeout, onclick: onclick };
        if (message) toastr.error(message, title);
    }
    public static Success(message?: string, title: string = 'Success', timeout: number = 10000, onclick: any = null) {
        message = message || 'Successfully saved data';
        toastr.options = { timeOut: timeout, onclick: onclick };
        toastr.success(message, title);
    }
    public static Warning(message: string, title: string = 'Warning', timeout: number = 10000, onclick: any = null) {
        toastr.options = { timeOut: timeout, onclick: onclick };
        toastr.warning(message, title);
    }
    public static ErrorResult(result: ResultApi, title: string = 'Error', timeout: number = 10000, onclick: any = null) {
        if (result && result.Description && result.Description.toString().indexOf('TypeError: You provided') >= 0)
            return;
        toastr.options = { timeOut: timeout, onclick: onclick };
        toastr.error((result && result.Description) || MessageHelper.SystemWrong, title);
    }
}