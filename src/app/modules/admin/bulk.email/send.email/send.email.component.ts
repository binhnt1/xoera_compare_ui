type AOA = any[][];
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { AppInjector } from '../../../../app.module';
import { BulkEmailService } from '../bulk.email.service';
import { FileData } from '../../../../_core/domains/data/file.data';
import { validation } from '../../../../_core/decorators/validator';
import { DataType } from '../../../../_core/domains/enums/data.type';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { ActionType } from '../../../../_core/domains/enums/action.type';
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PropertyData } from '../../../../_core/domains/data/property.data';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { Attachment, BulkMailDto } from '../../../../_core/domains/objects/bulk.email.dto';
import { EmailTemplateEntity } from '../../../../_core/domains/entities/email.template.entity';

@Component({
    templateUrl: './send.email.component.html',
    styleUrls: ['./send.email.component.scss'],
})
export class SendEmailComponent extends EditComponent implements OnInit {
    loading: boolean;
    processing: boolean;
    service: BulkEmailService;
    properties: PropertyData[];

    contacts: any[];
    item: BulkMailDto = new BulkMailDto();
    @ViewChild('inputFile') inputFile: ElementRef;
    @ViewChild('uploadFile') uploadFile: EditorComponent;

    constructor() {
        super();
        this.service = AppInjector.get(BulkEmailService);
    }

    ngOnInit() {
        this.renderActions();
    }

    public async sendEmail() {
        if (!this.item.Contacts || this.item.Contacts.length == 0) {
            ToastrHelper.Error('Contacts is null or empty, please choice', 'error', 5000);
            return;
        }

        this.processing = true;
        if (this.uploadFile.file.items && this.uploadFile.file.items.length > 0) {
            this.item.FileAttachments = [];
            this.uploadFile.file.items.forEach((item: FileData) => {
                let file: Attachment = {
                    AttachmentFile: item.Data,
                    AttachmentName: item.Name,
                    AttachmentSize: item.Size.toString(),
                };
                this.item.FileAttachments.push(file);
            });
        }
        let valid = await validation(this.item);
        if (valid) {
            await this.service.sendEmail(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success('Emails are sent successfully', 'Success', 5000);
                } else {
                    ToastrHelper.Error('Emails are sent fail, please try again', 'Error', 5000);
                }
            })
        }
        this.processing = false;
    }
    private async renderActions() {
        let actions: ActionData[] = [
            {
                icon: 'la la-play',
                name: 'Send Emails',
                processButton: true,
                className: 'btn btn-success',
                systemName: ActionType.Empty,
                click: () => {
                    this.sendEmail();
                }
            }
        ];
        this.actions = actions;

        let moreActions: ActionData[] = [
            {
                name: 'From File',
                icon: 'la la-file',
                className: 'btn btn-warning',
                systemName: ActionType.Empty,
                click: () => {
                    this.loadExcel();
                }
            },
            {
                name: 'Agent',
                icon: 'la la-group',
                className: 'btn btn-warning',
                systemName: ActionType.Empty,
                click: () => {
                    this.loadAgents();
                }
            },
            {
                name: 'Employee',
                icon: 'la la-group',
                className: 'btn btn-warning',
                systemName: ActionType.Empty,
                click: () => {
                    this.loadEmployees();
                }
            },
            {
                icon: 'la la-group',
                name: 'Broker Lead',
                className: 'btn btn-warning',
                systemName: ActionType.Empty,
                click: () => {
                    this.loadBrokerLeads();
                }
            }
        ];
        this.moreActions = {
            Icon: 'la la-bolt',
            Name: 'Load Contacts',
            Actions: moreActions,
        };
    }
    public emailTemplateChange() {
        if (this.item.EmailTemplateId) {
            this.service.item('EmailTemplate', this.item.EmailTemplateId).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    let item: EmailTemplateEntity = result.Object;
                    this.item.Content = item && item.TemplateHtml;
                }
            })
        }
    }

    public onFileChange() {
        /* wire up file reader */
        this.loading = true;
        let reader = new FileReader(),
            input = this.inputFile.nativeElement;
        if (input.files.length == 0)
            return;
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;

            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            let excelData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            if (wb.SheetNames.length > 1) {
                let numb = wsname.replace(/[^0-9\.]+/g, "");
                if (numb.length > 0 && wsname.substr(0, 5) != "Sheet") {
                    if (typeof excelData[0] === "object") {
                        excelData[0][excelData[0].length] = "Uplift";
                    }
                    for (let j = 1; j < excelData.length; j++) {
                        if (typeof excelData[j] === "object") {
                            excelData[j][excelData[0].length - 1] = numb;
                        }
                    }
                }
            }

            for (let i = 1; i < wb.SheetNames.length; ++i) {
                const sheet: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[i]];
                let sheetName = wb.SheetNames[i];
                let numb2 = sheetName.replace(/[^0-9\.]+/g, "");
                if (numb2.length > 0 && sheetName.substr(0, 5) != "Sheet") {
                    let data = <AOA>(XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 }));
                    for (let j = 0; j < data.length; j++) {
                        if (typeof data[j] === "object") {
                            data[j][excelData[0].length - 1] = numb2;
                        }
                    }
                    excelData = excelData.concat(data);
                }
            }
            let items: any[] = [];
            for (let i = 1; i < excelData.length; i++) {
                let surname = '',
                    forename = '',
                    item: any = {};
                for (let j = 0; j < excelData[i].length; j++) {
                    switch (excelData[0][j].toString().trim()) {
                        case 'Town': item.Town = excelData[i][j]; break;
                        case 'Surname': surname = excelData[i][j]; break;
                        case 'Title': item.Title = excelData[i][j]; break;
                        case 'Forename': forename = excelData[i][j]; break;
                        case 'Initial': item.Initial = excelData[i][j]; break;
                        case 'Country': item.Country = excelData[i][j]; break;
                        case 'Postcode': item.Postcode = excelData[i][j]; break;
                        case 'Email Address': item.Email = excelData[i][j]; break;
                        case 'Address Line 1': item.Address = excelData[i][j]; break;
                        case 'Trading Name At Location': item.Trading = excelData[i][j]; break;
                    }
                }
                item.Id = i;
                item.Name = surname + ' ' + forename;
                items.push(item);
            }
            this.contacts = items.filter(c => c.email && c.email != '');
            this.loading = false;
        };
        reader.readAsBinaryString(input.files[0]);
    }
    public checkedChange(items: any[]) {
        if (items && items.length > 0) {
            this.item.Contacts = _.cloneDeep(items);
            this.item.Emails = items.map(c => c.Email);
        } else {
            this.item.Emails = null;
            this.item.Contacts = null;
        }
    }

    private loadExcel() {
        this.inputFile.nativeElement.click();
    }
    private async loadAgents() {
        this.loading = true;
        this.properties = null;
        await this.service.loadContacts('agent').then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.properties = [
                    { Property: 'AgentId', Title: 'Id', Type: DataType.Number },
                    { Property: 'AgencyName', Type: DataType.String },
                    { Property: 'Nickname', Type: DataType.String },
                    { Property: 'Email', Type: DataType.String },
                    { Property: 'ConfidentialEmail', Type: DataType.String },
                    { Property: 'PrincipalUser', Type: DataType.String, Align: 'center' },
                ];
                this.contacts = result.Object;
            }
            this.loading = false;
        });
    }
    private async loadEmployees() {
        this.loading = true;
        this.properties = null;
        await this.service.loadContacts('employee').then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.properties = [
                    { Property: 'EmployeeId', Title: 'Id', Type: DataType.Number },
                    { Property: 'Name', Type: DataType.String },
                    { Property: 'Email', Type: DataType.String },
                ];
                this.contacts = result.Object;
            }
            this.loading = false;
        });
    }
    private async loadBrokerLeads() {
        this.loading = true;
        this.properties = null;
        await this.service.loadContacts('brokerlead').then((result: ResultApi) => {
            if (ResultApi.IsSuccess(result)) {
                this.properties = [
                    { Property: 'BrokerLeadId', Title: 'Id', Type: DataType.Number },
                    { Property: 'ContactName', Type: DataType.String },
                    { Property: 'BusinessName', Type: DataType.String },
                    { Property: 'Email', Type: DataType.String },
                    { Property: 'Phone1', Title: 'Phone', Type: DataType.String },
                    { Property: 'Mobile1', Title: 'Mobile', Type: DataType.String },
                    { Property: 'Website', Title: 'Website', Type: DataType.String },
                ];
                this.contacts = result.Object;
            }
            this.loading = false;
        });
    }
}