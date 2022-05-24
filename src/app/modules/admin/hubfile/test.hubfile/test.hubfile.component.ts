declare var $;
import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { HubFileService } from '../hubfile.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { EditComponent } from '../../../../_core/components/edit/edit.component';

@Component({
    templateUrl: './test.hubfile.component.html',
    styleUrls: ['./test.hubfile.component.scss'],
})
export class TestHubFileComponent extends EditComponent implements OnInit {
    nodes: number[];
    loadingText: string;
    loading: boolean = true;
    service: HubFileService;
    hubFileSummaryId: number = 7;

    constructor() {
        super();
        this.service = AppInjector.get(HubFileService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.addBreadcrumb('HubFile Test');
        this.loading = false;
        this.loadNodes();
    }

    resetNode() {
        this.service.resetNodeTest().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.resetColors();
                ToastrHelper.Success("Reset nodes success");
            } else {
                ToastrHelper.ErrorResult(result);
                return false;
            }
        });
    }

    loadNodes() {
        this.resetColors();
        this.service.loadNodeTest().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let items = result.Object as number[];
                if (items && items.length > 0) {
                    this.nodes = items;
                    setTimeout(() => this.renderColors(), 1000);
                }
            } else {
                ToastrHelper.ErrorResult(result);
                return false;
            }
        });
    }

    resetNode17() {
        this.service.resetNodeTest17().then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                let items = result.Object as number[];
                if (items && items.length > 0) {
                    this.resetColors();
                    this.nodes = items;
                    this.renderColors();
                }
                ToastrHelper.Success("Reset nodes success");
            } else {
                ToastrHelper.ErrorResult(result);
                return false;
            }
        });
    }

    async addNodeById(e: any) {
        let id = e && e.srcElement && e.srcElement.parentElement && e.srcElement.parentElement.id;
        if (!id) {
            let element = e && e.srcElement && e.srcElement.parentElement && e.srcElement.parentElement;
            id = element && element.parentElement && element.parentElement.id;
        }
        if (id) {
            let node = ConstantHelper.NODEIDS.find(c => c.id == id);
            if (node && node.nodeId)
                this.addNode(node.nodeId);
        }
    }

    private resetColors() {
        this.nodes = [];
        $('.rectangle .stred').remove();
        $('.rectangle').removeClass('green');
    }
    private renderColors() {
        if (this.nodes && this.nodes.length > 0) {
            this.nodes.forEach((item: number) => {
                let node = ConstantHelper.NODEIDS.find(c => c.nodeId == item);
                if (node && node.id) {
                    $('#' + node.id).addClass('green');
                    let element = $('#' + node.id + ' .stred'),
                        count = this.nodes.filter(c => c == item).length;
                    if (count) {
                        if (element && element.length > 0) {
                            element.html(count);
                        } else {
                            UtilityExHelper.addTextIntoSvg(node.id, count);
                        }
                    } else $('#' + node.id + ' .stred').remove();
                }
            });
        }
    }
    private async addNode(nodeId: number) {
        this.loading = true;
        this.loadingText = "Add node: " + nodeId + '...';
        await this.service.addNodeTest(nodeId).then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                ToastrHelper.Success("Create flow success");
                let items = result.Object as number[];
                if (items && items.length > 0) {
                    this.resetColors();
                    this.nodes = items;
                    this.renderColors();
                }
            } else {
                ToastrHelper.ErrorResult(result);
                return false;
            }
        });
        this.loading = false;
    }
}