import { UserType } from '../enums/user.type';
import { GenderType } from '../enums/gender.type';
import { UserEntity } from '../entities/user.entity';
import { UserActivityDto } from './user.activity.dto';
import { ImageDecorator } from '../../decorators/image.decorator';
import { TableDecorator } from '../../decorators/table.decorator';
import { LookupData, LookupUniqueData } from '../data/lookup.data';
import { StringDecorator } from '../../decorators/string.decorator';
import { NumberDecorator } from '../../decorators/number.decorator';
import { BooleanDecorator } from '../../decorators/boolean.decorator';
import { DateTimeDecorator } from '../../decorators/datetime.decorator';
import { BooleanType, DateTimeType, StringType } from '../enums/data.type';

@TableDecorator()
export class UserDto {
    @NumberDecorator()
    Id: number;

    @NumberDecorator() 
    CompanyId: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10 })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150 })
    Email: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;
    
    @BooleanDecorator()
    Locked: boolean;

    @DateTimeDecorator({ type: DateTimeType.Date, view: 'years' })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    FullName: string;

    Expires?: Date;
    Token?: string;
    Allow?: boolean;
    Activities?: UserActivityDto[];
}

@TableDecorator()
export class UserLoginDto {
    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    UserName: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100 })
    Password?: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100, requiredMatch: 'Password' })
    ConfirmPassword?: string;

    @BooleanDecorator({ label: 'Remember me' })
    RememberMe?: boolean;
    
    Activity?: UserActivityDto
}

@TableDecorator()
export class UserUpdateDto {
    Birthday: Date;
    Avatar: string;
    FullName: string;
    Gender: GenderType;
}

@TableDecorator()
export class UserProfileDto {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10, unique: LookupUniqueData.ReferenceUrl('/user/profileExists', 'PhoneNumber') })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150, unique: LookupUniqueData.ReferenceUrl('/user/profileExists', 'Email') })
    Email: string;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @DateTimeDecorator({ type: DateTimeType.Date, view: 'years' })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    FirstName: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    LastName: string;
}

@TableDecorator()
export class UserRegisterDto {
    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    UserName: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    FirstName: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    LastName: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100 })
    Password?: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100, requiredMatch: 'Password' })
    ConfirmPassword?: string;

    @StringDecorator({ required: true, type: StringType.Phone, max: 15 })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 100 })
    Email: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    CompanyName: string;

    @StringDecorator({ required: true, type: StringType.Text, max: 100 })
    ContactPerson: string;

    @StringDecorator({ required: true, type: StringType.Phone, max: 15 })
    ContactPhone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 100 })
    ContactEmail: string;

    @StringDecorator({ required: true, type: StringType.MultiText, max: 1000 })
    CompanyAddress: string;

    @BooleanDecorator()
    AgreeTerms: boolean;

    Activity?: UserActivityDto;
}

@TableDecorator()
export class UserForgotPasswordDto {
    @StringDecorator({ required: true, type: StringType.Email })
    Email: string;

    Activity?: UserActivityDto;
}

@TableDecorator()
export class UserChangePasswordDto {
    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100 })
    OldPassword: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100 })
    Password: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100, requiredMatch: 'Password' })
    ConfirmPassword: string;

    Activity?: UserActivityDto;
}

@TableDecorator()
export class AdminUserDto {
    Id: number;
    Email: string;
    Expires?: Date;
    Token?: string;
    Avatar?: string;
    FullName: string;
    Locked?: boolean;
    UserName: string;
    IsAdmin?: boolean;
    Gender: GenderType;
    UserType: UserType;
    CompanyId?: number;
    Activities: UserActivityDto[];
}

@TableDecorator()
export class AdminUserLoginDto {
    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    UserName: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100 })
    Password?: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100, requiredMatch: 'Password' })
    ConfirmPassword?: string;

    @BooleanDecorator({ label: 'Remember me' })
    RememberMe?: boolean;
    
    Activity?: UserActivityDto
}

@TableDecorator()
export class AdminUserUpdateDto {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10, unique: LookupUniqueData.Reference(UserEntity, 'PhoneNumber') })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150, unique: LookupUniqueData.Reference(UserEntity, 'Email') })
    Email: string;

    @BooleanDecorator({ type: BooleanType.RadioButton, lookup: LookupData.ReferenceEnum(GenderType) })
    Gender: GenderType;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;
    
    @BooleanDecorator()
    Locked: boolean;

    @StringDecorator({ type: StringType.MultiText, max: 550 })
    Address: string;

    @DateTimeDecorator({ type: DateTimeType.Date, view: 'years' })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    FirstName: string;

    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    LastName: string;

    Password: string;
    RoleIds: number[];
    Permissions: any[];
    RawPassword: string;
}

@TableDecorator()
export class AdminUserProfileDto {
    @NumberDecorator()
    Id: number;

    @StringDecorator({ type: StringType.PhoneText, min: 10, max: 10, unique: LookupUniqueData.ReferenceUrl('/user/profileExists', 'PhoneNumber') })
    Phone: string;

    @StringDecorator({ required: true, type: StringType.Email, max: 150, unique: LookupUniqueData.ReferenceUrl('/user/profileExists', 'Email') })
    Email: string;

    @ImageDecorator({ url: 'upload/uploadavatar' })
    Avatar: string;

    @DateTimeDecorator({ type: DateTimeType.Date, view: 'years' })
    Birthday: Date;

    @StringDecorator({ required: true, type: StringType.Account, max: 100 })
    FullName: string;
}

@TableDecorator()
export class AdminUserChangePasswordDto {
    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100 })
    OldPassword: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100 })
    Password: string;

    @StringDecorator({ required: true, type: StringType.Password, min: 6, max: 100, requiredMatch: 'Password' })
    ConfirmPassword: string;

    Activity?: UserActivityDto;
}

@TableDecorator()
export class AdminUserForgotPasswordDto {
    @StringDecorator({ required: true, type: StringType.Email })
    Email: string;
}