declare var $;
import { HubFileService } from '../../hubfile.service';
import { AppInjector } from '../../../../../app.module';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResultApi } from '../../../../../_core/domains/data/result.api';
import { ConstantHelper } from '../../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../../_core/helpers/utility.helper';

@Component({
    selector: 'diagram',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './diagram.component.html',
    styleUrls: [
        './diagram.component.scss',
        '../../../../../../app-assets/js/vp/vp-style-1.3.3.min.css'
    ],
})
export class DiagramComponent implements OnInit {
    nodes: any[];
    service: HubFileService;
    loading: boolean = false;

    constructor() {
        this.service = AppInjector.get(HubFileService);
        this.loadDiagram();
    }

    ngOnInit() {
    }

    async addNodeById(e: any) {
       console.log(e);
    }

    loadDiagram() {
        this.service.getDiagram().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let items = result.Object as any[];
                if (items && items.length > 0) {
                    this.resetColors();
                    this.nodes = items;
                    setTimeout(() => this.renderColors(), 1000);
                }
            }
            this.loading = false;
        });
    }

    private resetColors() {
        $('.rectangle .stred').remove();
        $('.rectangle').removeClass('green');
    }
    private renderColors() {
        if (this.nodes && this.nodes.length > 0) {
            this.nodes.forEach((item: any) => {
                let node = ConstantHelper.NODEIDS.find(c => c.nodeId == item.NodeId);
                if (node && node.id) {
                    $('#' + node.id).addClass('green');
                    let element = $('#' + node.id + ' .stred');
                    if (item.Count) {
                        if (element && element.length > 0) {
                            element.html(item.Count);
                        } else {
                            UtilityExHelper.addTextIntoSvg(node.id, item.Count);
                        }
                    } else $('#' + node.id + ' .stred').remove();
                }
            });
        }
    }
}