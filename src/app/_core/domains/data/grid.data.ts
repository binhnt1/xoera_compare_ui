import { ActionData } from "./action.data";
import { ModalSizeType } from "../enums/modal.size.type";

export class GridData {
    Url?: string;
    Title?: string;
    IsPopup?: boolean;
    TotalTitle?: string;
    Checkable?: boolean;
    Radioable?: boolean;
    SearchText?: string;
    IgnoreIds?: number[];
    Size?: ModalSizeType;
    HideSearch?: boolean;
    PageSizes?: number[];
    HidePaging?: boolean;
    EmbedComponent?: any;
    AsynLoad?: () => void;
    ReferenceKey?: string;
    Actions?: ActionData[];
    Exports?: ActionData[];
    Imports?: ActionData[];
    Filters?: ActionData[];
    ReferenceName?: string;
    Features?: ActionData[];
    LastUpdatedBy?: boolean;
    ActionIsFirst?: boolean;
    Reference?: new () => {};
    HideHeadActions?: boolean;
    NotKeepPrevData?: boolean;
    DisableAutoLoad?: boolean;
    StatisticalComponent?: any;
    MoreActions?: ActionData[];
    HideCustomFilter?: boolean;
    MoreFeatures?: MoreActionData;
    CustomFilters?: string[] | any[];
    InlineFilters?: string[] | any[];
}

export class MoreActionData {
    Icon: string;
    Name: string;
    Actions?: ActionData[]
}