import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { LookupData } from "../domains/data/lookup.data";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { BooleanType, DataType } from "../domains/enums/data.type";

export class BooleanEx extends ObjectEx {
    public type?: BooleanType;
    public lookup?: LookupData;
}

export function BooleanDecorator(options?: BooleanEx) {
    if (!options)
        options = new BooleanEx();
    options.dataType = DataType.Boolean;
    if (!options.allowSearch) options.allowSearch = false;
    if (!options.type) options.type = BooleanType.Checkbox;
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