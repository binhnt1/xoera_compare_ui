import "reflect-metadata";
import { UtilityExHelper } from "../helpers/utility.helper";
import { registerClass } from "./register.metadata";

export class TableEx {
    name?: string;
    title?: string;
    className?: string;
}

export function TableDecorator(table?: TableEx) {
    return function (constructor: Function) {
        if (!table) table = new TableEx();
        if (!table.className) table.className = constructor.name;
        if (!table.name) table.name = constructor.name.replace('Entity', '');
        if (!table.title) table.title = UtilityExHelper.createLabel(table.name);
        registerClass(table);
    }
}