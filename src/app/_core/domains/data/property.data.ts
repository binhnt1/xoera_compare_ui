import { OptionItem } from "./option.item";
import { DataType } from "../enums/data.type";
import { PipeType } from "../enums/pipe.type";
import { OrderType } from "../enums/order.type";
import { TabFilterType } from "../enums/tab.filter.type";
import { ObjectEx } from "../../decorators/object.decorator";

export class PropertyData {
    public Title?: string;
    public Type: DataType;
    public Align?: string;
    public Property: string;
    public Active?: boolean;
    public Order?: OrderType;
    public PageSize?: number;
    public PageIndex?: number;
    public PipeType?: PipeType;
    public ColumnWidth?: number;
    public ReferenceId?: string;
    public AllowFilter?: boolean;
    public ActiveFilter?: boolean;
    public SumOrCount?: () => any;
    public LoadingFilter?: boolean;
    public AllowLoadMore?: boolean;
    public ColumnFilter?: ObjectEx;
    public ItemFilters?: OptionItem[];
    public ItemFiltersSearch?: string;
    public Click?: (obj?: any) => any;
    public Format?: (obj?: any) => any;
    public AllowFilterInline?: boolean;
    public HideCheckbox?: (obj?: any) => boolean;
    public TabFilterType?: TabFilterType = TabFilterType.Basic;
}