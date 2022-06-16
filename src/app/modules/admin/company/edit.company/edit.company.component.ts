declare var google;
import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { MethodType } from '../../../../_core/domains/enums/method.type';
import { CompanyDto } from '../../../../_core/domains/objects/company.dto';
import { UtilityExHelper } from '../../../../_core/helpers/utility.helper';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { UserActivityHelper } from '../../../../_core/helpers/user.activity.helper';

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
                this.addBreadcrumb(this.id ? 'Edit' : 'Add');
            }
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
            await this.service.item('company', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(CompanyDto, result.Object as CompanyDto);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
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
            });
        }, 1000);
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
                return await this.service.callApi('user',  'adminCreateCompany', obj, MethodType.Put).then((result: ResultApi) => {
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