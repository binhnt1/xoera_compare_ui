declare var $;
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { SiteService } from '../site.service';
import { AppInjector } from '../../../../app.module';
import { FileData } from '../../../../_core/domains/data/file.data';
import { SiteType } from '../../../../_core/domains/enums/site.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ONUPDType } from '../../../../_core/domains/enums/onupd.type';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { ConstantHelper } from '../../../../_core/helpers/constant.helper';
import { SiteEntity } from '../../../../_core/domains/entities/site.entity';
import { MeterEntity } from '../../../../_core/domains/entities/meter.entity';
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ModalSizeType } from '../../../../_core/domains/enums/modal.size.type';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ViewContentComponent } from '../site.test/view.content/view.content.component';
import { MeterPointEntity } from '../../../../_core/domains/entities/meter.point.entity';
import { PopupS40RequestComponent } from '../popup.s40.request/popup.s40.request.component';
import { PopupT05RequestComponent } from '../popup.t05.request/popup.t05.request.component';
import { PopupC41RequestComponent } from '../popup.c41.request/popup.c41.request.component';
import { PopupC42RequestComponent } from '../popup.c42.request/popup.c42.request.component';
import { PopupONARequestComponent } from '../popup.ona.request/popup.ona.request.component';
import { PopupU01RequestComponent } from '../popup.u01.request/popup.u01.request.component';
import { MeterWorkRequestType } from '../../../../_core/domains/enums/meter.work.request.type';
import { PopupDateRequestComponent } from '../popup.date.request/popup.date.request.component';
import { PopupONJOBRequestComponent } from '../popup.onjob.request/popup.onjob.request.component';
import { PopupORJOBRequestComponent } from '../popup.orjob.request/popup.orjob.request.component';
import { PopupONUPDRequestComponent } from '../popup.onupd.request/popup.onupd.request.component';
import { HubFileTreeComponent } from '../../hubfile/components/hubfile.tree/hubfile.tree.component';

@Component({
    templateUrl: './view.site.component.html',
    styleUrls: [
        './view.site.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class ViewSiteComponent extends EditComponent implements OnInit {
    id: number;
    tab: string;
    viewer: boolean;
    nodes: number[];
    zoom: number = 1;
    meter: MeterEntity;
    loadingText: string;
    service: SiteService;
    save: boolean = true;
    nodeProcessing: boolean;
    loadingDiagram: boolean;
    loading: boolean = true;
    loadingHubFile: boolean;
    loadingDiagramText: string;
    meterPoint: MeterPointEntity;
    item: SiteEntity = new SiteEntity();
    @ViewChild('fileInput') fileInput: ElementRef;
    outgoings: number[] = [1, 4, 7, 10, 18, 21, 24, 27, 30, 33, 36, 41, 50, 53, 59, 61, 62, 65, 67, 68, 71, 74, 79, 84, 87, 90, 95, 100, 103, 106];

    @Input() params: any;

    constructor() {
        super();
        this.service = AppInjector.get(SiteService);
        this.router = AppInjector.get(Router);
        this.state = this.getUrlState();
        if (this.state) {
            this.id = this.state.id;
            this.viewer = this.state.viewer;
            this.addBreadcrumb(this.id ? 'Edit' : 'Add');
        }
        if (this.router?.routerState?.snapshot?.root?.queryParams["save"]) {
            this.save = this.router?.routerState?.snapshot?.root?.queryParams["save"] == 'true';
            if (!this.save) {
                setTimeout(() => {
                    this.addBreadcrumb('Site Test');
                }, 300);
            }
        }
    }

    zoomPlus() {
        this.zoom += 0.2;
        if (this.zoom >= 3) this.zoom = 3;
        $('.svg').attr('transform', 'scale(' + this.zoom + ')');
    }

    zoomMinus() {
        this.zoom -= 0.2;
        if (this.zoom <= 1) this.zoom = 1;
        $('.svg svg').attr('transform', 'scale(' + this.zoom + ')');
    }

    async ngOnInit() {
        await this.renderPage();
    }

    selectedTab(tab: string) {
        this.tab = tab;
        if (this.tab == 'flow' || this.tab == 'test') {
            this.loadNodes();
            this.resetColors();
            this.renderCursor();
        }
    }

    public readFile(files: any) {
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let item: FileData = {
                    Path: null,
                    Percent: 0,
                    Name: file.name,
                    NativeData: file,
                    Size: file.size / 1024 / 1024,
                };

                let FR = new FileReader();
                FR.onload = () => {
                    item.Data = FR.result;
                    if (item.Data) {
                        this.dialogService.WapperAsync({
                            cancelText: 'Close',
                            title: 'View hierarchy',
                            size: ModalSizeType.Large,
                            object: HubFileTreeComponent,
                            objectExtra: { content: item.Data },
                        });
                    }
                };
                FR.onerror = () => {
                    ToastrHelper.Error('File ' + file.name + ' error, please choose another file');
                };
                FR.readAsText(file);
            }
        }
    }
    public selectedFile(event: any) {
        let files = event.srcElement.files;
        if (files && files.length > 0) {
            this.readFile(files);
        }
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
                this.addNode(node.nodeId, this.save);
        }
    }
    selectedMeter(item: MeterEntity) {
        this.meter = item;
    }
    loadedMeterPoint(item: MeterPointEntity) {
        this.meterPoint = item;
    }

    private loadNodes() {
        this.loadingDiagramText = "Loading diagram...";
        if (this.id) {
            this.loadingHubFile = true;
            this.loadingDiagram = true;
            this.service.loadNodes(this.id).then((result: ResultApi) => {
                this.loadingDiagram = false;
                setTimeout(() => this.loadingHubFile = false, 1000);
                if (ResultApi.IsSuccess(result)) {
                    let items = result.Object as number[];
                    if (items && items.length > 0) {
                        this.resetColors();
                        this.nodes = items;
                        setTimeout(() => this.renderColors(), 1000);
                    }
                } else {
                    ToastrHelper.ErrorResult(result);
                    return false;
                }
            });
        }
    }
    private async loadItem() {
        this.item = new SiteEntity();
        if (this.id) {
            await this.service.item('site', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(SiteEntity, result.Object as SiteEntity);
                    this.item.SiteType = this.item.Type == 'Domestic' ? SiteType.Domestic : SiteType.Commercial;
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async renderPage() {
        this.loading = true;
        this.renderActions();
        await this.loadItem();
        this.loading = false;
    }
    private async renderActions() {
        let actions: ActionData[] = [
            ActionData.back(() => { this.back() }),
            ActionData.reload(async () => {
                await this.renderPage();
                if (this.tab == 'flow') {
                    this.loadNodes();
                    this.resetColors();
                    this.renderCursor();
                }
            })
        ];
        if (!this.save) {
            actions.push({
                name: 'Incoming File',
                icon: 'la la-upload',
                systemName: ActionType.Empty,
                className: 'btn btn-success',
                click: () => {
                    this.fileInput.nativeElement.click();
                }
            });
        }
        this.actions = await this.authen.actionsAllow(SiteEntity, actions);
    }
    private viewContent(content: string) {
        setTimeout(() => {
            this.dialogService.WapperAsync({
                title: 'Raw Data',
                cancelText: 'Close',
                size: ModalSizeType.Large,
                object: ViewContentComponent,
                objectExtra: { data: content },
            });
        }, 1000);
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
                    }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
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
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
        } else if (nodeId == 41) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Large,
                title: 'Create MAM Appointment',
                object: PopupONARequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
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
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
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
                    type: MeterWorkRequestType.Exchange
                },
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
        } else if (nodeId == 71) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Large,
                title: 'Create AQ Correction',
                object: PopupC41RequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
        } else if (nodeId == 74) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Medium,
                object: PopupC42RequestComponent,
                title: 'AQ Correction Cancellation',
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
        } else if (nodeId == 79) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                title: 'Objection Raised',
                size: ModalSizeType.Small,
                object: PopupS40RequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
        } else if (nodeId == 95) {
            valid = false;
            this.dialogService.WapperAsync({
                cancelText: 'Close',
                confirmText: 'Create',
                size: ModalSizeType.Large,
                title: 'Create U01 Closing',
                object: PopupU01RequestComponent,
                objectExtra: { nodeId: nodeId, siteId: this.id, save: save },
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
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
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
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
            }, async (result: ResultApi) => { save ? this.loadNodes() : this.viewContent(result.Object); });
        }
        this.loadingDiagramText = "Generate Files...";
        if (valid && this.outgoings.indexOf(nodeId) >= 0) {
            this.loadingDiagram = true;
            this.loadingText = "Create flow" + '...';
            await this.service.createNode(nodeId, this.id, null, save).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    if (save) {
                        ToastrHelper.Success("Create flow success");
                        let items = result.Object as number[];
                        if (items && items.length > 0) {
                            this.resetColors();
                            this.nodes = items;
                            this.renderColors();
                        }
                    } else this.viewContent(result.Object);
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