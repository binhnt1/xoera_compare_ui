import { OptionItem } from "./option.item";
import { DropdownLoadType } from "../enums/data.type";
import { EnumHelper } from "../../helpers/enum.helper";

export class LookupData {    
    url?: string;                   // Đường dẫn api
    params?: any;                   // Tham số thêm khi load data
    unit?: string;                  // Đơn vị
    cached?: number;                // Thời gian cache phía client (0 || null => không cache)
    decimals?: number;              // Số lượng số thập phân
    dependId?: string;              // Trường phụ thuộc khi trường này thay đổi thì load lại data
    numberMax?: number;             // Số lớn nhất đối với 1 số combobox cho phép thay đổi giá trị từ - đến
    items?: OptionItem[];           // Danh sách các phần tử
    selected?: OptionItem;          // Chọn 1 phần tử nào đó
    emptyItem?: OptionItem;         // Phần tử rỗng 
    propertyValue?: string;         // Trường để select
    propertyGroup?: string;         // Trường để group
    propertyDisplay?: string[];     // Trường để hiển thị
    loadType?: DropdownLoadType;    // Kiểu load dữ liệu

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

    public static ReferenceUrlWithCache(url: string, cached?: number): LookupData {
        return {
            url: url,
            dependId: null,
            emptyItem: null,
            propertyGroup: null,
            propertyValue: 'Id',
            propertyDisplay: ['Name'],
            loadType: DropdownLoadType.All,
            cached: cached ? cached * 1000 : 3600 * 1000,
        };
    }

    public static ReferenceNumbers(items: number[], propertyDisplay?: string[], propertyValue?: string): LookupData {
        return {
            loadType: DropdownLoadType.All,
            propertyValue: propertyValue || 'value',
            propertyDisplay: propertyDisplay || ['label'],
            items: OptionItem.createOptionItemsFromArrayNumber(items),
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

    public static ReferenceItems(items: OptionItem[], propertyDisplay?: string[], propertyValue?: string): LookupData {
        return {
            items: items,
            loadType: DropdownLoadType.All,
            propertyValue: propertyValue || 'Id',
            propertyDisplay: propertyDisplay || ['Name'],
        };
    }

    public static Reference(target: any, propertyDisplay?: string[], propertyValue?: string, dependId?: string, emptyItem?: OptionItem, cached?: number): LookupData {
        let name: string = typeof target == 'string'
            ? target.toString()
            : target.name;
        name = name.replace('Entity', '');
        return {
            dependId: dependId,
            emptyItem: emptyItem,
            url: '/' + name + '/lookup',
            loadType: DropdownLoadType.All,
            cached: cached ? cached * 1000 : 0,
            propertyValue: propertyValue || 'Id',
            propertyDisplay: propertyDisplay || ['Name'],
        };
    }

    public static ReferenceUrl(url: string, propertyDisplay?: string[], propertyValue?: string, dependId?: string, propertyGroup?: string, emptyItem?: OptionItem, cached?: number): LookupData {
        return {
            url: url,
            dependId: dependId,
            emptyItem: emptyItem,
            propertyGroup: propertyGroup,
            loadType: DropdownLoadType.All,
            cached: cached ? cached * 1000 : 0,
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