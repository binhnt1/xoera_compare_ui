import { BaseEntity } from "./base.entity";
import { LicenceEntity } from "./licence.entity";
import { LookupData } from "../data/lookup.data";
import { StoreType, StringType } from "../enums/data.type";
import { ImageDecorator } from "../../decorators/image.decorator";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ name: 'Parameter' })
export class ParameterEntity extends BaseEntity {

    @ImageDecorator({ store: StoreType.Database })
    Logo: string;

    @StringDecorator({ required: true, max: 45, type: StringType.Text })
    DbName: string;

    @StringDecorator({ required: true, max: 45, type: StringType.Text })
    DbUser: string;

    @StringDecorator({ required: true, max: 25, type: StringType.Text })
    DbPass: string;

    @StringDecorator({ required: true, max: 15, type: StringType.Text })
    DatabaseIp: string;

    @StringDecorator({ max: 45, type: StringType.Text })
    SchDbName: string;

    @StringDecorator({ max: 125, type: StringType.Text })
    BingKey: string;

    @StringDecorator({ max: 25, type: StringType.Text })
    ImUserPfx: string;

    @StringDecorator({ max: 500, type: StringType.Text })
    CustAppApiUrl: string;

    @StringDecorator({ max: 500, type: StringType.Text })
    XcfcmServerKey: string;

    @StringDecorator({ max: 15, type: StringType.Text })
    RoutingEngineIp: string;

    @StringDecorator({ max: 500, type: StringType.Text })
    DriversAppApiUrl: string;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(LicenceEntity, ['DeviceId']) })
    LicenceId: number;

    @BooleanDecorator()
    RoutingEnginePermitted: boolean;

    @BooleanDecorator()
    AddressSearchPermitted: boolean;
}
