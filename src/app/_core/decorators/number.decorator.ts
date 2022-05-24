import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { NumberType, DataType } from "../domains/enums/data.type";

export class NumberEx extends ObjectEx {
    public min?: number;
    public max?: number;
    public step?: number;
    public unit?: string;
    public type?: NumberType;
    public decimals?: number;
    public allowZero?: boolean;
}

export function NumberDecorator(options?: NumberEx) {
    if (!options)
        options = new NumberEx();
    options.dataType = DataType.Number;
    if (!options.min) options.min = 0;
    if (!options.step) options.step = 1;
    if (!options.max) options.max = 1000000;
    if (!options.decimals) options.decimals = 0;
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.type) options.type = NumberType.Numberic;
    if (options.allowZero === undefined || options.allowZero === null) options.allowZero = false;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = true;
    return function (target: Object, propertyKey: string) {
        let label = options.label || UtilityExHelper.createLabel(propertyKey);
        options.property = propertyKey;
        options.target = target.constructor.name;
        if (!options.label) options.label = label;
        if (!options.placeholder) options.placeholder = options.label || label;
        if (options.required) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Required, message: label + ' can\'t null or empty' });
        }
        if (options.unique) {
            if (!options.validators) options.validators = [];
            options.validators.push({ pattern: PatternType.Unique, unique: options.unique, message: label + ' is exists' });
        }
        registerProperty(target.constructor.name, propertyKey, options);
    }
}