import { StatusType } from "../domains/enums/status.type";
import { ConstantHelper } from "./constant.helper";

export class UtilityExHelper {

    public static dateString(date: Date) {
        if (!date) return '';
        if (date == null) return '';
        if (typeof date == 'string')
            date = new Date(date);

        var message = '';
        var month = date.getMonth() + 1;
        message += (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        message += '/' + (month < 10 ? '0' + month : month);
        message += '/' + date.getFullYear();
        return message;
    }

    public static copyString(text: string) {
        if (text && text.length > 0) {
            const selBox = document.createElement('textarea');
            selBox.value = text;
            selBox.style.top = '0';
            selBox.style.left = '0';
            selBox.style.opacity = '0';
            selBox.style.position = 'fixed';
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
        }
    }

    public static randomText(length: number) {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static dateTimeString(date: Date) {
        if (!date) return '';
        if (date == null) return '';
        if (typeof date == 'string')
            date = new Date(date);

        var message = '';
        var month = date.getMonth() + 1;
        message += (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        message += '/' + (month < 10 ? '0' + month : month);
        message += '/' + date.getFullYear();
        message += ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        message += ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        return message;
    }

    public static parseDate(dateString: string) {
        var parts = dateString.split('/').map(c => parseInt(c));
        return new Date(parts[2], parts[1] - 1, parts[0])
    }

    public static escapeHtml(html: string): string {
        if (!html) return '';
        var text = document.createTextNode(html);
        var p = document.createElement('p');
        p.appendChild(text);
        return p.innerHTML;
    }

    public static createLabel(property: string): string {
        if (!property || property == property.toUpperCase()) return property;

        if (ConstantHelper.LABELS.containsKey(property))
            return ConstantHelper.LABELS[property];
        if (property.endsWith('Id')) {
            let propertyName = property.replace('Id', '');
            if (ConstantHelper.LABELS.containsKey(propertyName))
                return ConstantHelper.LABELS[propertyName];
        }

        let result: string = '',
            label = property.substr(0, 1).toUpperCase() + property.substr(1);
        for (let i = 0; i < label.length; i++) {
            let character = label[i],
                characterNext = i < label.length - 1 ? label[i + 1] : '';
            if (i == 0) result += character;
            else if (character == character.toUpperCase()) {
                if (!characterNext) result += character;
                else if (characterNext == characterNext.toUpperCase()) {
                    result += character;
                } else result += ' ' + character;
            } else {
                if (!characterNext) result += character;
                else if (characterNext == characterNext.toUpperCase()) {
                    result += character + ' ';
                } else result += character;
            }
        }
        result = result.replace('_', '').replace('  ', ' ');
        return result;
    }

    public static formatText(text: string, status: StatusType) {
        switch (status) {
            case StatusType.Success:
                return '<span class=\"kt-badge kt-badge--inline kt-badge--success\">' + text + '</span>';
            case StatusType.Warning:
                return '<span class=\"kt-badge kt-badge--inline kt-badge--warning\">' + text + '</span>';
            case StatusType.Error:
                return '<span class=\"kt-badge kt-badge--inline kt-badge--danger\">' + text + '</span>';
        }
    }

    public static trimChar(string: string, charToRemove: string): string {
        while (string.charAt(0) == charToRemove) {
            string = string.substring(1);
        }
        while (string.charAt(string.length - 1) == charToRemove) {
            string = string.substring(0, string.length - 1);
        }
        return string;
    }

    public static clearUrlState() {
        let stateKey = 'params',
            sessionKey = 'session_' + stateKey;
        sessionStorage.removeItem(sessionKey);
    }
    
    public static addTextIntoSvg(id: string, count: number) {
        let mysvg = document.getElementById(id);
        let interval = setInterval(() => {
            let myText = document.createTextNode(count.toString());
            let myTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            myTextElement.setAttribute("fill", "#ffffff");
            myTextElement.setAttribute("class", "stred");
            myTextElement.setAttribute("y", "1558");
            myTextElement.setAttribute("x", "90");
            myTextElement.appendChild(myText);
            if (mysvg) {
                mysvg.appendChild(myTextElement);
                clearInterval(interval);
            }
        }, 500);
    }
}