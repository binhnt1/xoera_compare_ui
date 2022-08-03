declare var $;
import { ObjectEx } from "./object.decorator";
import { StringEx } from "./string.decorator";
import { AppInjector } from "../../app.module";
import { ResultApi } from "../domains/data/result.api";
import { ToastrHelper } from "../helpers/toastr.helper";
import { PatternType } from "../domains/enums/pattern.type";
import { DecoratorHelper } from "../helpers/decorator.helper";
import { LookupUniqueData } from "../domains/data/lookup.data";
import { AdminApiService } from "../services/admin.api.service";
import { DataType, StringType } from "../domains/enums/data.type";
import { AdminEventService } from "../services/admin.event.service";

export class Validator {
    pattern: any;
    message?: string;
    unique?: LookupUniqueData;
}

export async function validation(target: any, columns?: string[], disableEmit: boolean = false): Promise<boolean> {
    function matchPattern(value: string, pattern: any) {
        return pattern && pattern.test(String(value).toLowerCase());
    }

    let valid: boolean = true;
    let service = AppInjector.get(AdminApiService);
    let eventService = AppInjector.get(AdminEventService);
    let decorators = DecoratorHelper.decoratorProperties(target, false);
    if (decorators) {
        for (let i = 0; i < decorators.length; i++) {
            let decorator: ObjectEx = decorators[i]; decorator.error = null;
            if (!disableEmit) eventService.Validate.emit(decorator);
            let needValid: boolean = true;
            if (columns && columns.length > 0) {
                let column = columns.find(c => c == decorator.property);
                if (!column) needValid = false;
            }
            if (!needValid) continue;

            let value = target[decorator.property],
                vaildProperty: boolean = true;
            if (decorator.required) {
                if (!value) {
                    vaildProperty = false;
                    if (eventService) {
                        let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Required);
                        decorator.error = (validator && validator.message) || (decorator.label + ' can\'t null or empty');
                        if (!disableEmit) eventService.Validate.emit(decorator);
                    }
                }
            }
            if (value) {
                if (vaildProperty) {
                    let validator = decorator.validators && decorator.validators.find(c => c.pattern && typeof c.pattern != 'string');
                    if (validator) {
                        vaildProperty = matchPattern(value, validator.pattern);
                        if (!vaildProperty && eventService) {
                            decorator.error = (validator && validator.message) || (decorator.label + ' incorrect format');
                            if (!disableEmit) eventService.Validate.emit(decorator);
                        }
                    }
                }
                if (vaildProperty) {
                    if (decorator.dataType == DataType.String) {
                        let decoratorString: StringEx = decorator;
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Max);
                            if (validator) {
                                let length = value ? value.length : 0;
                                if (!length && value.address) length = value.address.length;
                                vaildProperty = length <= decoratorString.max;
                                if (!vaildProperty && eventService) {
                                    decorator.error = (validator && validator.message) || (decorator.label + ' the maximum length is ' + decoratorString.max + ' characters');
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Min);
                            if (validator) {
                                let length = value ? value.length : 0;
                                if (!length && value.address) length = value.address.length;
                                vaildProperty = length >= decoratorString.min;
                                if (!vaildProperty && eventService) {
                                    decorator.error = (validator && validator.message) || (decorator.label + ' the minimum length is ' + decoratorString.min + ' characters');
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.RequiredMatch);
                            if (validator) {
                                let valueMatch = target[decoratorString.requiredMatch];
                                vaildProperty = valueMatch == value;
                                if (!vaildProperty && eventService) {
                                    decorator.error = (validator && validator.message) || (decorator.label + ' do not match ' + decoratorString.requiredMatch);
                                    if (!disableEmit) eventService.Validate.emit(decorator);
                                }
                            }
                        }
                        if (vaildProperty) {
                            let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.CardCvc);
                            if (validator) {
                                let $element = <any>$('#' + decorator.id);
                                if ($element && $element.length > 0) {
                                    vaildProperty = (<any>$).payment.validateCardNumber(value);
                                    if (!vaildProperty && eventService) {
                                        decorator.error = (validator && validator.message) || (decorator.label + ' incorrect format');
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            }
                        }
                        if (vaildProperty) {
                            if (decoratorString.type == StringType.Phone) {
                                let $element = <any>$('#' + decorator.id);
                                if ($element && $element.length > 0) {
                                    vaildProperty = $element.intlTelInput('isValidNumber');
                                    if (!vaildProperty && eventService) {
                                        let errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"],
                                            errorCode = $element.intlTelInput('getValidationError'),
                                            errorMessage = errorMap[errorCode];
                                        decorator.error = decorator.label + ' incorrect format';
                                        if (!disableEmit) eventService.Validate.emit(decorator);
                                    }
                                }
                            } 
                        }
                    }
                }
            }
            if (valid) valid = vaildProperty;
        }
        if (valid) {
            for (let i = 0; i < decorators.length; i++) {
                let decorator: ObjectEx = decorators[i]; decorator.error = null;
                if (!disableEmit) eventService.Validate.emit(decorator);
                let needValid: boolean = true;
                if (columns && columns.length > 0) {
                    let column = columns.find(c => c == decorator.property);
                    if (!column) needValid = false;
                }
                if (!needValid) continue;
                let value = target[decorator.property],
                    vaildProperty: boolean = true;
                if (value) {
                    //check exists
                    if (vaildProperty) {
                        let validator = decorator.validators && decorator.validators.find(c => c.pattern && c.pattern == PatternType.Unique);
                        if (validator) {
                            let valueExists = value,
                                valueId = target['Id'],
                                unique = validator.unique;
                            if (service) {
                                vaildProperty = await service.exists(unique.url, unique.property, valueId, valueExists).then((result: ResultApi) => {
                                    if (ResultApi.IsSuccess(result)) {
                                        if (result.Object) return false;
                                    }
                                    return true;
                                }, (e) => {
                                    ToastrHelper.Exception(e);
                                    return false;
                                });
                            }
                            if (!vaildProperty && eventService) {
                                decorator.error = (validator && validator.message) || (decorator.label + ' is exists');
                                if (!disableEmit) eventService.Validate.emit(decorator);
                            }
                        }
                    }
                }
                if (valid) valid = vaildProperty;
            }
        }
    }
    return valid;
}