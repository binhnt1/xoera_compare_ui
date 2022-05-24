import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class ValidatorHelper {
    public constructor() { }

    public static validEmail(value: string): boolean {
        if (ValidatorHelper.validRequied(value)) {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase());
        }
        return false;
    }

    public static validPhone(value: string): boolean {
        if (ValidatorHelper.validRequied(value)) {
            let re = /^\d+$/;
            return re.test(String(value).toLowerCase());
        }
        return false;
    }
    
    public static validRequied(value: string): boolean {
        return value && value.length > 0;
    }

    public static validFontUpload(files: any): boolean {
        if (files && files[0]) {
            let file = files[0];
        if (file.name.search(/.(otf|ttf|woff)/) < 0)
                return false;
            if (file.size > 30 * 1024 * 1024)
                return false;
            return true;
        }
        return false;
    }

    public static validFileUpload(files: any): boolean {
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (file.type.search(/image\/(jpg|jpeg|png|gif|svg)/) < 0)
                    return false;
                if (file.size > 5 * 1024 * 1024)
                    return false;
            }
            return true;
        }
        return false;
    }

    public static validImageUpload(files: any): boolean {
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                if (file.type.search(/image\/(jpg|jpeg|png|gif|svg)/) < 0)
                    return false;
                if (file.size > 5 * 1024 * 1024)
                    return false;
            }
            return true;
        }
        return false;
    }

    public static validLength(value: string, maxLength: number = 255, minLength: number = 0) {
        if (value) {
            return value.length >= minLength && value.length <= maxLength;
        }
        return false;
    }
}