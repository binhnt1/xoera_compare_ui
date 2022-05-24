declare var $;
declare var tinymce: any;
import * as _ from 'lodash';
import { StringType } from '../../domains/enums/data.type';
import { StringEx } from '../../decorators/string.decorator';
import { UtilityExHelper } from '../../helpers/utility.helper';
import { EditorParamData } from '../../domains/data/editor.param.data';
import { Component, EventEmitter, Input, NgZone, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'editor-htmlbox',
    templateUrl: 'htmlbox.component.html',
    styleUrls: ['htmlbox.component.scss']
})
export class HtmlBoxComponent implements OnChanges {
    focused: boolean;
    @Input() value: string;
    @Input() decorator: StringEx;
    @Output() valueChange = new EventEmitter<string>();

    constructor(public zone: NgZone) {
    }

    ngOnInit() {
        if (!this.decorator)
            this.decorator = new StringEx();
        if (!this.decorator.min) this.decorator.min = 0;
        this.decorator.id = UtilityExHelper.randomText(8);
        if (!this.decorator.max) this.decorator.max = 5000;
        if (!this.decorator.placeholder) this.decorator.placeholder = '';
        if (!this.decorator.type) this.decorator.type = StringType.Html;
        setTimeout(() => {
            let elementId = 'textarea#' + this.decorator.id,
                $element = $(elementId);
            if ($element && $element.length > 0) {
                let variables = this.decorator.variables && this.decorator.variables.length > 0,
                    toolbar = 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                    plugins = ['advlist autolink lists link image charmap print preview anchor textcolor', 'searchreplace visualblocks code fullscreen variable code', 'insertdatetime media table paste help wordcount'];
                if (variables) toolbar = 'menuVariables | ' + toolbar;
                tinymce.remove(elementId);
                tinymce.init({
                    height: 500,
                    skin: "snow",
                    icons: "thin",
                    menubar: true,
                    language: 'vi',
                    toolbar: toolbar,
                    plugins: plugins,
                    selector: elementId,
                    readonly: this.decorator.readonly ? 1 : null,
                    setup: (editor: any) => {
                        if (variables) {
                            this.decorator.variables.forEach((item: EditorParamData) => {
                                let name = 'F1_' + item.name + '_Icon';
                                editor.ui.registry.addIcon(name.toLowerCase(), item.icon);
                                if (item.childrens && item.childrens.length > 0) {
                                    item.childrens.forEach((child: EditorParamData) => {
                                        name = 'F2_' + child.name + '_Icon';
                                        editor.ui.registry.addIcon(name.toLowerCase(), child.icon);
                                    });
                                }
                            });
                            editor.ui.registry.addMenuButton('menuVariables', {
                                text: 'Parameters',
                                title: 'Parameters',
                                fetch: (callback: any) => {
                                    let items = [];
                                    for (let i = 0; i < this.decorator.variables.length; i++) {
                                        let item: any = {},
                                            itemVarible = this.decorator.variables[i];
                                        item.type = itemVarible.childrens && itemVarible.childrens.length > 0
                                            ? 'nestedmenuitem'
                                            : 'menuitem';
                                        item.icon = ('F1_' + itemVarible.name + '_Icon').toLowerCase();
                                        item.text = itemVarible.title || UtilityExHelper.createLabel(itemVarible.name);
                                        if (itemVarible.name) {
                                            item.onAction = () => {
                                                editor.plugins.variable.addVariable(itemVarible.name);
                                            }
                                        }
                                        if (itemVarible.childrens && itemVarible.childrens.length > 0) {
                                            let childItems = [];
                                            for (let j = 0; j < itemVarible.childrens.length; j++) {
                                                let itemF2: any = {},
                                                    itemVaribleF2 = itemVarible.childrens[j];
                                                itemF2.type = 'menuitem';
                                                itemF2.icon = ('F2_' + itemVaribleF2.name + '_Icon').toLowerCase();
                                                itemF2.text = itemVaribleF2.title || UtilityExHelper.createLabel(itemVaribleF2.name);
                                                if (itemVaribleF2.name) {
                                                    itemF2.onAction = () => {
                                                        editor.plugins.variable.addVariable(itemVaribleF2.name);
                                                    }
                                                }
                                                childItems.push(itemF2);
                                            }
                                            item.getSubmenuItems = () => {
                                                return childItems;
                                            }
                                        }
                                        items.push(item);
                                    }
                                    callback(items);
                                }
                            });
                        }
                    },
                    init_instance_callback: (editor: any) => {
                        editor.on('focus', () => {
                            this.zone.run(() => {
                                this.focused = true;
                            });
                        });
                        editor.on('click', () => {
                            this.zone.run(() => {
                                this.focused = true;
                            });
                        });
                        editor.on('blur', () => {
                            this.zone.run(() => {
                                this.value = tinymce.get(this.decorator.id).getContent();
                                this.valueChange.emit(this.value);
                                this.focused = false;
                            });
                        });
                    },
                    content_style: ".variable{cursor:default;background-color:#5867dd;color:#FFF;padding:0px 6px;border-radius:3px;font-style:normal;display:inline-block;}"
                });
            }
        }, 300);
    }

    ngOnChanges(changes: any) {
        if (changes) {
            if (changes.value) {
                if (changes.value.currentValue != changes.value.previousValue) {
                    this.setValue();
                }
            }
        }
    }

    private setValue() {
        let elementId = 'textarea#' + this.decorator.id,
            $element = $(elementId);
        if ($element && $element.length > 0) {
            tinymce.get(this.decorator.id).setContent(this.value);
            this.valueChange.emit(this.value);
        }
    }
}
