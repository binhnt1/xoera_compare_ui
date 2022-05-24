import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { PatternType } from "../domains/enums/pattern.type";
import { UtilityExHelper } from "../helpers/utility.helper";
import { StringType, DataType } from "../domains/enums/data.type";
import { EditorParamData } from "../domains/data/editor.param.data";

export class StringEx extends ObjectEx {
    public min?: number;
    public max?: number;
    public rows?: number;
    public type?: StringType;
    public requiredMatch?: string;
    public variables?: EditorParamData[];
}

export function StringDecorator(options?: StringEx) {
    if (!options)
        options = new StringEx();
    options.dataType = DataType.String;
    if (!options.min) options.min = 0;
    if (!options.rows) options.rows = 5;
    if (!options.type) options.type = StringType.Text;
    if (!options.allowClear) options.allowClear = true;
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.id) options.id = UtilityExHelper.randomText(8);
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    if (!options.max) {
        switch (options.type) {
            case StringType.Code: options.max = 50; break;
            case StringType.Text: options.max = 255; break;
            case StringType.Phone: options.max = 15; break;
            case StringType.Email: options.max = 50; break;
            case StringType.Skype: options.max = 50; break;
            case StringType.Search: options.max = 50; break;
            case StringType.Link: options.max = 1000; break;
            case StringType.Address: options.max = 250; break;
            case StringType.Account: options.max = 100; break;
            case StringType.Password: options.max = 20; break;
            case StringType.PhoneText: options.max = 15; break;
            case StringType.MultiText: options.max = 2000; break;
        }
    }
    if (!options.icon) {
        switch (options.type) {
            case StringType.Code: options.icon = 'la la-code'; break;
            case StringType.Link: options.icon = 'la la-link'; break;
            case StringType.Phone: options.icon = 'la la-phone'; break;
            case StringType.Skype: options.icon = 'la la-skype'; break;
            case StringType.Account: options.icon = 'la la-user'; break;
            case StringType.Password: options.icon = 'la la-key'; break;
            case StringType.Search: options.icon = 'la la-search'; break;
            case StringType.Email: options.icon = 'la la-envelope'; break;
            case StringType.PhoneText: options.icon = 'la la-phone'; break;
            case StringType.Address: options.icon = 'socicon-google'; break;
        }
    }
    return function (target: Object, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.validators) options.validators = [];
        if (!options.placeholder) options.placeholder = options.label || label;
        switch (options.type) {
            case StringType.Card: {
                options.validators.push({
                    pattern: PatternType.CardNumber,
                    message: label + ' incorrect format'
                });
            }
                break;
            case StringType.Link: {
                options.validators.push({
                    pattern: new RegExp('^(https?:\\/\\/)?' + // protocol
                        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                        '(\\#[-a-z\\d_]*)?$', 'i'),
                    message: label + ' incorrect format'
                });
            }
                break;
            case StringType.Email: {
                options.validators.push({
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: label + ' incorrect format'
                });
            }
                break;
            case StringType.Phone: {
                options.validators.push({
                    pattern: /^[\+]*\d+$/,
                    message: label + ' incorrect format'
                });
            }
                break;
            case StringType.PhoneText: {
                options.validators.push({
                    pattern: /^[\+]*\d+$/,
                    message: label + ' incorrect format'
                });
            }
                break;
        }
        if (options.required) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Required, message: label + ' can\'t null or empty' });
        }
        if (options.unique) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Unique, unique: options.unique, message: label + ' is exists' });
        }
        if (options.requiredMatch) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.RequiredMatch, message: label + ' does not match ' + UtilityExHelper.createLabel(options.requiredMatch) });
        }
        if (options.max > 0) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Max, message: label + ' the maximum length is ' + options.max + ' characters' });
        }
        if (options.min > 0) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Min, message: label + ' the minimum length is ' + options.min + ' characters' });
        }
        registerProperty(target.constructor.name, propertyKey, options);
    }
}