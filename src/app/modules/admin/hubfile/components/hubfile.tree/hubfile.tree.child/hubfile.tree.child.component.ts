import { Component, Input, OnInit } from '@angular/core';
import { UtilityExHelper } from '../../../../../../_core/helpers/utility.helper';
import { HubFileFlow } from '../../../../../../_core/domains/entities/hubfile.entity';

@Component({
    selector: 'hubfile-tree-child',
    styleUrls: ['./hubfile.tree.child.component.scss'],
    templateUrl: './hubfile.tree.child.component.html'
})
export class HubFileTreeChildComponent implements OnInit {
    obj: string[];
    properties: any[];
    @Input() item: HubFileFlow;
    @Input() className: string;

    ngOnInit() {
        if (this.item && this.item.Data) {
            this.obj = JSON.parse(this.item.Data);
            this.properties = Object.keys(this.obj);
            if (this.properties)
                this.properties = this.properties
                    .filter(c => this.obj[c])
                    .filter(c => !c.endsWith('Id'))
                    .filter(c => typeof this.obj[c] !== 'object')
                    .map(c => {
                        return {
                            property: c,
                            label: UtilityExHelper.createLabel(c),
                        }
                    });
        }
    }
}