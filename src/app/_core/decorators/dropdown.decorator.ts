import { ObjectEx } from "./object.decorator";
import { registerProperty } from "./register.metadata";
import { LookupData } from "../domains/data/lookup.data";
import { PatternType } from "../domains/enums/pattern.type";
import { UtilityExHelper } from "../helpers/utility.helper";
import { DataType, DropdownLoadType } from "../domains/enums/data.type";

export class DropDownEx extends ObjectEx {
    public multiple?: boolean; 
    public lookup?: LookupData;
    public autoSelect?: boolean;
}

export function DropDownDecorator(options?: DropDownEx) {
    if (!options)
        options = new DropDownEx();
    options.dataType = DataType.DropDown;
    if (!options.allowSearch) options.allowSearch = false;
    if (options.multiple == null) options.multiple = false;
    if (!options.lookup) options.lookup = new LookupData();
    if (!options.lookup.propertyValue) options.lookup.propertyValue = 'Id';
    if (!options.lookup.loadType) options.lookup.loadType = DropdownLoadType.All;
    if (!options.lookup.propertyDisplay) options.lookup.propertyDisplay = ['Name'];
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