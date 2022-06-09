import { Validator } from "./validator";
import { DataType } from "../domains/enums/data.type";
import { registerProperty } from "./register.metadata";
import { PatternType } from "../domains/enums/pattern.type";
import { UtilityExHelper } from "../helpers/utility.helper";
import { LookupUniqueData } from "../domains/data/lookup.data";

export class ObjectEx {
    public id?: string;
    public key?: string;
    public icon?: string;
    public unit?: string;
    public index?: number;
    public label?: string;
    public error?: string;
    public subfix?: string;
    public target?: string;
    public property?: string;
    public readonly?: boolean;
    public required?: boolean;
    public dataType?: DataType;
    public placeholder?: string;
    public description?: string;
    public allowClear?: boolean;
    public allowSearch?: boolean;
    public allowFilter?: boolean;
    public validators?: Validator[];
    public unique?: LookupUniqueData;
    public customValidators?: Validator[];
}

export function ObjectDecorator(options?: ObjectEx) {
    if (!options)
        options = new ObjectEx();
    options.dataType = DataType.String;
    if (!options.allowClear) options.allowClear = true;
    if (!options.allowSearch) options.allowSearch = false;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    return function (target: any, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.placeholder) options.placeholder = options.label || label;
        if (!options.id) options.id = options.target + '_' + propertyKey + '_' + UtilityExHelper.randomText(8);
        if (options.required) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Required, message: label + ' can\'t null or empty' });
        }
        if (options.unique) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Unique, unique: options.unique, message: label + ' have exists' });
        }
        registerProperty(target.constructor.name, propertyKey, options);
    }
}