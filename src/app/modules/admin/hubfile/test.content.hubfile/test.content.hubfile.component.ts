declare var $;
import * as _ from 'lodash';
import { Component, OnInit } from "@angular/core";
import { AppInjector } from '../../../../app.module';
import { HubFileService } from '../hubfile.service';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { PopupDateRequestComponent } from '../../site/popup.date.request/popup.date.request.component';

@Component({
    templateUrl: './test.content.hubfile.component.html',
    styleUrls: ['./test.content.hubfile.component.scss'],
})
export class TestContentHubFileComponent extends EditComponent implements OnInit {
    nodes: number[];
    loadingText: string;
    loading: boolean = true;
    service: HubFileService;
    loadingDiagram: boolean;
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
    private renderCursor() {
        setTimeout(() => {
            this.outgoings.forEach((nodeId: number) => {
                let node = ConstantHelper.NODEIDS.find(c => c.nodeId == nodeId);
                if (node) {
                    $('#' + node.id).addClass('cursor');
                }
            });
        }, 2000);
    }
    private async addNode(nodeId: number, save: boolean = true) {
        let valid = true;
        if (this.nodeProcessing)
            return;
        this.nodeProcessing = true;
        if (nodeId == 7) {
            this.loadingDiagram = true;
            this.loadingText = "Prev checking...";
            valid = await this.service.prevCheckNode(nodeId, this.id).then((result: ResultApi) => {
                this.loadingDiagram = false;
                if (ResultApi.IsSuccess(result)) {
                    return true;
                } else {
                    this.dialogService.WapperAsync({
                        cancelText: 'Close',
                        confirmText: 'Create',
                        size: ModalSizeType.Small,
                        title: 'Create flow S38/S42',
                        object: PopupDateRequestComponent,
                        objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
                    }, async () => { this.loadNodes(); });
                    return false;
                }
            }, () => {
                this.loadingDiagram = false;
                return false;
            });
            this.loadingDiagram = false;
        } else if (nodeId == 10) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Medium,
                object: PopupT05RequestComponent,
                title: 'Confirmation Cancellation',
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 41) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Large,
                title: 'Create MAM Appointment',
                object: PopupONARequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 50) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                size: ModalSizeType.Small,
                confirmText: 'Create',
                title: 'Create MAM Appointment',
                object: PopupONARequestComponent,
                objectExtra: {
                    type: 1,
                    save: save,
                    nodeId: nodeId,
                    siteId: this.id,
                },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 62) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                title: 'Create ORJOB',
                size: ModalSizeType.Large,
                object: PopupORJOBRequestComponent,
                objectExtra: { 
                    save: save,
                    nodeId: nodeId, 
                    siteId: this.id, 
                    type: MeterWorkRequestType.Exchange },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 71) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Large,
                title: 'Create AQ Correction',
                object: PopupC41RequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 74) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Medium,
                object: PopupC42RequestComponent,
                title: 'AQ Correction Cancellation',
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 79) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                title: 'Objection Raised',
                size: ModalSizeType.Small,
                object: PopupS40RequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 95) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Large,
                title: 'Create U01 Closing',
                object: PopupU01RequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 103) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                size: ModalSizeType.Large,
                confirmText: 'Create',
                title: 'Create ONJOB',
                object: PopupONJOBRequestComponent,
                objectExtra: { 
                    save: save, 
                    nodeId: nodeId, 
                    siteId: this.id, 
                    type: MeterWorkRequestType.Exchange, 
                },
            }, async () => { this.loadNodes(); });
        } else if (nodeId == 106) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                title: 'Create ONUPD',
                size: ModalSizeType.Large,
                object: PopupONUPDRequestComponent,
                objectExtra: { 
                    save: save, 
                    nodeId: nodeId, 
                    siteId: this.id, 
                    type: ONUPDType.Found, 
                },
            }, async () => { this.loadNodes(); });
        }
        this.loadingDiagramText = "Generate Files...";
        if (valid && this.outgoings.indexOf(nodeId) >= 0) {
            this.loadingDiagram = true;
            this.loadingText = "Create flow" + '...';
            await this.service.createNode(nodeId, this.id, null, save).then((result: ResultApi) => {
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
            this.loadingDiagram = false;
        }
        this.nodeProcessing = false;
    }
}