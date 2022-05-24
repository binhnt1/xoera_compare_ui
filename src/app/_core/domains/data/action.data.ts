import { ActionType } from "../enums/action.type";

export class ButtonData {
    public name?: string;
    public icon?: string;
    public className?: string;
    public systemName: string;
    public controllerName?: string;
    public processButton?: boolean;
    public click?: (obj?: any) => any;
    public hidden?: (obj?: any) => boolean;
}

export class ActionData extends ButtonData {
    public static back(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Go back',
            icon: 'la la-hand-o-left',
            systemName: ActionType.Empty,
            className: 'btn btn-outline-secondary',
            click: () => {
                if (click) click();
                else history.back();
            }
        }
        return item;
    }

    public static addNew(click?: () => any): ActionData {
        let item: ActionData = {
            icon: 'la la-plus',
            name: ActionType.AddNew,
            className: 'btn btn-primary',
            systemName: ActionType.AddNew,
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static reload(click?: () => any): ActionData {
        let item: ActionData = {
            name: 'Reload',
            icon: 'la la-refresh',
            systemName: ActionType.Empty,
            className: 'btn btn-success',
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static edit(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-pencil',
            name: ActionType.Edit,
            systemName: ActionType.Edit,
            className: 'btn btn-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static view(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-eye',
            name: ActionType.View,
            systemName: ActionType.View,
            className: 'btn btn-warning',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static active(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            name: ActionType.Publish,
            icon: 'la la-toggle-off',
            className: 'btn btn-warning',
            systemName: ActionType.Publish,
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static delete(click?: (item: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-trash',
            name: ActionType.Delete,
            className: 'btn btn-danger',
            systemName: ActionType.Delete,
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static history(click?: (item?: any) => any): ActionData {
        let item: ActionData = {
            icon: 'la la-history',
            name: ActionType.History,
            systemName: ActionType.History,
            className: 'btn btn-outline-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }

    public static saveAddNew(name: string, click?: () => any): ActionData {
        let item: ActionData = {
            name: name,
            processButton: true,
            icon: 'la la-plus-circle',
            className: 'btn btn-primary',
            systemName: ActionType.AddNew,
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static saveUpdate(name: string, click?: () => any): ActionData {
        let item: ActionData = {
            icon: 'la la-save',
            processButton: true,
            systemName: ActionType.Edit,
            name: name || 'Save',
            className: 'btn btn-primary',
            click: () => {
                if (click) click();
            }
        }
        return item;
    }

    public static gotoEdit(name: string, click?: (item: any) => any): ActionData {
        let item: ActionData = {
            name: name,
            icon: 'la la-pencil',
            systemName: ActionType.Edit,
            className: 'btn btn-primary',
            click: (item: any) => {
                if (click) click(item);
            }
        }
        return item;
    }
}