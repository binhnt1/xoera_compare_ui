import { OptionItem } from "./option.item";
import { DropdownLoadType } from "../enums/data.type";
import { EnumHelper } from "../../helpers/enum.helper";

export class LookupData {
    url?: string;
    dependId?: string;
    items?: OptionItem[];
    propertyValue?: string;
    propertyGroup?: string;
    propertyDisplay?: string[];
    loadType?: DropdownLoadType;

    public static ReferenceEnum(target: any, colors?: string[]): LookupData {
        let items = EnumHelper.exportOptionItems(target);
        if (items && items.length > 0 &&
            colors && items.length == colors.length) {
            for (let i = 0; i < items.length; i++) {
                items[i].color = colors[i];
            }
        }
        return {
            items: items,
            propertyValue: 'value',
            propertyDisplay: ['label'],
            loadType: DropdownLoadType.All,
        };
    }

    public static ReferenceStrings(items: string[], propertyDisplay?: string[], propertyValue?: string): LookupData {
        return {
            loadType: DropdownLoadType.All,
            propertyValue: propertyValue || 'value',
            propertyDisplay: propertyDisplay || ['label'],
            items: OptionItem.createOptionItemsFromArray(items),
        };
    }

    public static ReferenceNumbers(items: number[], propertyDisplay?: string[], propertyValue?: string): LookupData {
        return {
            loadType: DropdownLoadType.All,
            propertyValue: propertyValue || 'value',
            propertyDisplay: propertyDisplay || ['label'],
            items: OptionItem.createOptionItemsFromNumberArray(items),
        };
    }

    public static ReferenceItems(items: OptionItem[], propertyDisplay?: string[], propertyValue?: string): LookupData {
        return {
            items: items,
            loadType: DropdownLoadType.All,
            propertyValue: propertyValue || 'Id',
            propertyDisplay: propertyDisplay || ['Name'],
        };
    }

    public static Reference(target: any, propertyDisplay?: string[], propertyValue?: string, dependId?: string): LookupData {
        let name: string = typeof target == 'string'
            ? target.toString()
            : target.name;
        name = name.replace('Entity', '');
        return {
            dependId: dependId,
            url: '/' + name + '/lookup',
            loadType: DropdownLoadType.All,
            propertyValue: propertyValue || 'Id',
            propertyDisplay: propertyDisplay || ['Name'],
        };
    }

    public static ReferenceUrl(url: string, propertyDisplay?: string[], propertyValue?: string, dependId?: string): LookupData {
        return {
            url: url,
            dependId: dependId,
            loadType: DropdownLoadType.All,
            propertyValue: propertyValue || 'Id',
            propertyDisplay: propertyDisplay || ['Name'],
        };
    }
}

export class LookupUniqueData {
    url?: string;
    property?: string;

    public static Reference(target: any, property?: string): LookupUniqueData {
        let name: string = typeof target == 'string'
            ? target.toString()
            : target.name;
        name = name.replace('Entity', '');
        return {
            url: '/' + name + '/exists',
            property: property || 'Name',
        };
    }

    public static ReferenceUrl(url: string, property?: string): LookupUniqueData {
        return {
            url: url,
            property: property || 'Name',
        };
    }
}