import { OptionItem } from "../domains/data/option.item";
import { ModalSizeType } from "../domains/enums/modal.size.type";
import { UtilityExHelper } from "./utility.helper";

export class EnumHelper {
    public static exportOptionItems(type: any): OptionItem[] {
        let result: OptionItem[] = [];
        for (var item in type) {
            if (typeof type[item] === 'number') {
                result.push({
                    value: type[item],
                    label: UtilityExHelper.createLabel(item),
                });
            }
        }
        if (!result || result.length == 0) {
            for (var item in type) {
                result.push({
                    value: type[item],
                    label: UtilityExHelper.createLabel(item),
                });
            }
        }
        return result;
    }

    public static exportName(type: any, value: any) {
        let items = this.exportOptionItems(type);
        if (items && items.length > 0) {
            let item = items.find(c => c.value == value);
            return item && UtilityExHelper.createLabel(item.label);
        }
        return '';
    }

    public static exportModalSize(value: ModalSizeType) {
        switch (value) {
            case ModalSizeType.Small:
                return 'modal-sm';
            case ModalSizeType.Large:
                return 'modal-lg';
            case ModalSizeType.Medium:
                return 'modal-md';
            case ModalSizeType.ExtraLarge:
                return 'modal-xl';
            case ModalSizeType.FullScreen:
                return 'modal-fs';
            default:
                return 'modal-md';
        }
    }

    public static exportCompareOptionItems(type: any): OptionItem[] {
        let result: OptionItem[] = [];
        for (var item in type) {
            if (typeof type[item] === 'number') {
                result.push({
                    label: item,
                    value: type[item],
                });
            }
        }
        if (!result || result.length == 0) {
            for (var item in type) {
                result.push({
                    value: type[item],
                    label: item,
                });
            }
        }
        return result;
    }
}