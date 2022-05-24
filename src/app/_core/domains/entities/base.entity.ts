import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DateTimeDecorator } from "../../decorators/datetime.decorator";
import { NumberDecorator } from "../../decorators/number.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { TableDecorator } from "../../decorators/table.decorator";

@TableDecorator()
export class BaseEntity {
    @NumberDecorator({ allowSearch: true})
    Id: number;

    @BooleanDecorator()
    Active?: boolean;

    @BooleanDecorator()
    Deleted?: boolean;
    
    @StringDecorator()
    CreatedBy?: number;

    @DateTimeDecorator()
    CreatedAt?: Date;

    @DateTimeDecorator()
    LastUpdatedAt?: Date;

    @StringDecorator()
    LastUpdatedBy?: number;

    Checked?: boolean;
    Checkable?: boolean;
}