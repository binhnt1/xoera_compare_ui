import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { UtilityExHelper } from "../helpers/utility.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { StoreType, DataType } from "../domains/enums/data.type";

export class FileEx extends ObjectEx {
    public url?: string;
    public store?: StoreType;
    public multiple?: boolean;
}

export function FileDecorator(options?: FileEx) {
    if (!options)
        options = new FileEx();
    options.dataType = DataType.File;
    if (!options.store) options.store = StoreType.Local;
    if (!options.allowSearch) options.allowSearch = false;
    if (options.store == StoreType.Database) options.multiple = false;
    if (options.allowFilter === undefined || options.allowFilter === null) options.allowFilter = false;
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