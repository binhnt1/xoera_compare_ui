import { BaseEntity } from "./base.entity";
import { StringType } from "../enums/data.type";
import { TableDecorator } from "../../decorators/table.decorator";
import { StringDecorator } from "../../decorators/string.decorator";

@TableDecorator()
export class HelpQuestionEntity extends BaseEntity {
    @StringDecorator({ max: 1000 })
    Tags?: string;

    @StringDecorator({ required: true, max: 250 })
    Type: string;

    @StringDecorator({ required: true, max: 1000 })
    Question: string;

    @StringDecorator({ type: StringType.Html })
    Answer?: string;
}

export class QuestionDto {
    type: string;
    slug?: string;
    tags?: string;
    answer?: string;
    question: string;
    collapsed?: boolean;
}
