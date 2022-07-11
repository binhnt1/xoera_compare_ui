declare var google;
import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { ActionData } from '../../../../_core/domains/data/action.data';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { CompanyDto } from '../../../../_core/domains/objects/company.dto';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { UserActivityHelper } from '../../../../_core/helpers/user.activity.helper';
import { NavigationStateData } from '../../../../_core/domains/data/navigation.state';

@Component({
    templateUrl: './edit.company.component.html',
    styleUrls: [
        './edit.company.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditCompanyComponent extends EditComponent implements OnInit {
    id: number;
    tab: string;
    circle: any;
    options: any;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    item: CompanyDto = new CompanyDto();

    constructor() {
        super();
        this.service = AppInjector.get(AdminApiService);
        this.state = this.getUrlState();
    }

    async ngOnInit() {
        this.id = this.params && this.params['id'];
        this.popup = this.params && this.params['popup'];
        this.viewer = this.params && this.params['viewer'];
        if (!this.popup) {
            if (this.state) {
                this.id = this.state.id;
                this.viewer = this.state.viewer;
                this.addBreadcrumb(this.id ? (this.viewer ? 'View' : 'Edit') : 'Add');
            }
            this.renderActions();
        }
        await this.loadItem();
        setTimeout(() => {
            this.renderGoogleAddress();
        }, 500);
        this.loading = false;
    }
    selectedTab(tab: string) {
        this.tab = tab;
    }

    private async loadItem() {
        this.item = new CompanyDto();
        if (this.id) {
            await this.service.callApi('company', 'item/' + this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CompanyDto, result.Object as CompanyDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    private async renderActions() {
        let actions: ActionData[] = this.id
            ? [
                ActionData.back(() => { this.back() }),
                this.viewer
                    ? ActionData.gotoEdit("Edit", () => { this.edit(this.item) })
                    : ActionData.saveUpdate('Save', () => { this.confirmAndBack() }),
            ]
            : [
                ActionData.back(() => { this.back() }),
                ActionData.saveAddNew('Add new', () => { this.confirmAndBack() })
            ];
        this.actions = await this.authen.actionsAllow(CompanyDto, actions);
    }
    private async confirmAndBack() {
        await this.confirm(() => {
            this.back();
        });
    }
    private renderGoogleAddress() {
        setTimeout(() => {
            this.options = {
                componentRestrictions: {
                    country: 'gb'
                }
            };
            this.circle = new google.maps.Circle({
                radius: 775000,
                center: {
                    lat: 54.093409,
                    lng: -2.89479
                }
            });
            let inputPlace = new google.maps.places.Autocomplete(document.getElementById('company-address'), this.options);
            inputPlace.setBounds(this.circle.getBounds());
            google.maps.event.addListener(inputPlace, 'place_changed', () => {
                let place = inputPlace.getPlace(),
                    lat = place.geometry.location.lat(),
                    lng = place.geometry.location.lng();
                this.item.Lat = parseFloat(lat.toFixed(6));
                this.item.Lng = parseFloat(lng.toFixed(6));
                let postCode: string = place.plus_code?.global_code;
                if (postCode && postCode.indexOf('+') >= 0)
                    postCode = postCode.split('+')[0];
                this.item.PostCode = postCode;
                this.item.CompanyAddress = (<any>document.getElementById('company-address')).value;

                this.item.PHOLat = this.item.Lat;
                this.item.PHOLng = this.item.Lng;
                this.item.PHOName = this.item.CompanyName;
                this.item.PHOPostCode = this.item.PostCode;
                this.item.PHOPhone = this.item.CompanyPhone;
                this.item.PHOAddress = this.item.CompanyAddress;
            });


            let inputPHOPlace = new google.maps.places.Autocomplete(document.getElementById('pho-address'), this.options);
            inputPHOPlace.setBounds(this.circle.getBounds());
            google.maps.event.addListener(inputPHOPlace, 'place_changed', () => {
                let place = inputPHOPlace.getPlace(),
                    lat = place.geometry.location.lat(),
                    lng = place.geometry.location.lng();
                this.item.PHOLat = parseFloat(lat.toFixed(6));
                this.item.PHOLng = parseFloat(lng.toFixed(6));
                let postCode: string = place.plus_code?.global_code;
                if (postCode && postCode.indexOf('+') >= 0)
                    postCode = postCode.split('+')[0];
                this.item.PHOPostCode = postCode;
            });
        }, 1000);
    }
    private edit(item: CompanyDto) {
        let obj: NavigationStateData = {
            id: item.Id,
            prevUrl: '/admin/company',
            prevData: this.state.prevData,
        };
        this.router.navigate(['/admin/company/edit'], { state: { params: JSON.stringify(obj) } });
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            let columns = this.authen.management
                ? ['FullName', 'Phone', 'Email', 'CompanyName', 'CompanyPhone', 'CompanyEmail']
                : ['FullName', 'Phone', 'Email', 'CompanyName', 'CompanyPhone', 'CompanyEmail'];
            if (await validation(this.item, columns)) {
                this.processing = true;
                let obj: CompanyDto = _.cloneDeep(this.item);

                // save
                obj.RawPassword = UtilityExHelper.randomText(6);
                obj.Password = UserActivityHelper.CreateHash256(obj.RawPassword);
                return await this.service.callApi('user', 'adminAddOrUpdateCompany', obj, MethodType.Put).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Create company success');
                        if (complete) complete();
                        return true;
                    } else {
                        ToastrHelper.ErrorResult(result);
                        return false;
                    }
                }, () => {
                    this.processing = false;
                    return false;
                });
            }
        }
        return false;
    }
}