import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { LicenceEntity } from "./licence.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { ImageDecorator } from "../../decorators/image.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { BooleanDecorator } from "../../decorators/boolean.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator()
export class ParameterEntity extends BaseEntity {
    @ImageDecorator({ url: 'upload/uploadParameter' })
    Logo: string;

    @StringDecorator({ required: true, type: StringType.Password, max: 20 })
    DbPass: string;

    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    DbUser: string;

    @StringDecorator({ required: true, type: StringType.Account, max: 150 })
    DbName: string;

    @StringDecorator({ max: 128 })
    BingKey: string;

    @StringDecorator({ max: 25 })
    ImUserPfx: string;

    @StringDecorator({ max: 45 })
    SchDbName: string;

    @StringDecorator({ max: 15 })
    DatabaseIp: string;

    @StringDecorator({ max: 512 })
    CustAppApiUrl: string;

    @StringDecorator({ max: 600 })
    XcfcmServerKey: string;

    @StringDecorator({ max: 15 })
    RoutingEngineIp: string;

    @StringDecorator({ max: 512 })
    DriversAppApiUrl: string;

    @BooleanDecorator()
    RoutingEnginePermitted: boolean;

    @BooleanDecorator()
    AddressSearchPermitted: boolean;

    @DropDownDecorator({ label: 'Licence', lookup: LookupData.Reference(LicenceEntity) })
    LicenceId: number;
}