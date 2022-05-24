import { ResultApi } from "./result.api";
import { DropDownEx } from "../../decorators/dropdown.decorator";

export class OptionItem {
    public value: any;
    public icon?: string;
    public label: string;
    public group?: string;
    public color?: string;
    public selected?: boolean;

    constructor(value: any, label: string) {
        this.value = value;
        this.label = label;
        this.selected = false;
    }

    public static createOptionItemsFromBoolean() {
        let options: OptionItem[] = [
            { value: true, label: 'True' },
            { value: false, label: 'False' }
        ];
        return options;
    }

    public static createOptionItemsFromArray(items: string[]) {
        let options: OptionItem[] = [];
        if (items) {
            items.forEach((item: string) => {
                let option: OptionItem = {
                    label: item,
                    value: item,
                    icon: item.indexOf('socicon') >= 0 || item.indexOf('la ') >= 0
                        ? item
                        : null,
                };
                options.push(option);
            });
        }
        return options;
    }

    public static createOptionItemsFromNumberArray(items: number[]) {
        let options: OptionItem[] = [];
        if (items) {
            items.forEach((item: number) => {
                let option: OptionItem = {
                    value: item,
                    label: item.toString(),
                };
                options.push(option);
            });
        }
        return options;
    }

    public static createOptionItems(result: ResultApi, decorator: DropDownEx) {
        let options: OptionItem[] = [];
        if (ResultApi.IsSuccess(result)) {
            let items = result.Object as any[];
            if (items) {
                items.forEach((item: any) => {
                    let label: string = '', group = '';
                    if (decorator.lookup.propertyDisplay) {
                        decorator.lookup.propertyDisplay.forEach((field: string) => {
                            label += label ? ' - ' + item[field] : item[field];
                        });
                    }
                    let option: OptionItem = {
                        label: label,
                        value: item[decorator.lookup.propertyValue],
                        group: decorator.lookup.propertyGroup ? item[decorator.lookup.propertyGroup] : null
                    };
                    options.push(option);
                });
            }
        }
        return options;
    }

    public static createOptionItemsFromObject(items: any[], property: string) {
        let options: OptionItem[] = [];
        if (items && items.length > 0) {
            items.forEach((item: any) => {
                let option: OptionItem = {
                    label: item && item[property],
                    value: item && item[property],
                };
                options.push(option);
            });
        }
        return options;
    }
}
