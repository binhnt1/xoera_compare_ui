import { BaseEntity } from "./base.entity";
import { UserEntity } from "./user.entity";
import { StoreType } from "../enums/data.type";
import { LookupData } from "../data/lookup.data";
import { VehicleTypeEntity } from "./vehicle.type.entity";
import { TableDecorator } from "../../decorators/table.decorator";
import { ImageDecorator } from "../../decorators/image.decorator";
import { StringDecorator } from "../../decorators/string.decorator";
import { DropDownDecorator } from "../../decorators/dropdown.decorator";

@TableDecorator({ title: 'Vehicle Type Mapping' })
export class VehicleTypeMappingEntity extends BaseEntity {

    @StringDecorator({ required: true, max: 25 })
    Name: string;

    @ImageDecorator({ store: StoreType.Database })
    Icon: string;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AccountId: number;

    @DropDownDecorator({ required: true, lookup: LookupData.Reference(VehicleTypeEntity, ['TypeName', 'NoOfPassengers', 'NoOfLuggeges']) })
    VehTypeId: number;
}