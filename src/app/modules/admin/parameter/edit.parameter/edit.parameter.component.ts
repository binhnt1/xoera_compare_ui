import * as _ from 'lodash';
import { AppInjector } from '../../../../app.module';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { validation } from '../../../../_core/decorators/validator';
import { ResultApi } from '../../../../_core/domains/data/result.api';
import { ToastrHelper } from '../../../../_core/helpers/toastr.helper';
import { EntityHelper } from '../../../../_core/helpers/entity.helper';
import { EditorComponent } from '../../../../_core/editor/editor.component';
import { AdminApiService } from '../../../../_core/services/admin.api.service';
import { EditComponent } from '../../../../_core/components/edit/edit.component';
import { ParameterEntity } from '../../../../_core/domains/entities/parameter.entity';

@Component({
    templateUrl: './edit.parameter.component.html',
    styleUrls: [
        './edit.parameter.component.scss',
        '../../../../../assets/css/modal.scss'
    ],
})
export class EditParameterComponent extends EditComponent implements OnInit {
    id: number;
    popup: boolean;
    viewer: boolean;
    @Input() params: any;
    loading: boolean = true;
    service: AdminApiService;
    loadingTemplate: boolean = false;
    item: ParameterEntity = new ParameterEntity();
    @ViewChild('uploadLogo') uploadLogo: EditorComponent;

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
        this.loading = false;
    }

    private async loadItem() {
        this.item = new ParameterEntity();
        if (this.id) {
            await this.service.item('parameter', this.id).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    this.item = EntityHelper.createEntity(ParameterEntity, result.Object as ParameterEntity);
                } else {
                    ToastrHelper.ErrorResult(result);
                }
            });
        }
    }
    public async confirm(complete: () => void): Promise<boolean> {
        if (this.item) {
            if (await validation(this.item)) {
                this.processing = true;

                let obj: ParameterEntity = _.cloneDeep(this.item);

                // upload Logo
                let images = await this.uploadLogo.upload();
                obj.Logo = images && images.length > 0 && images[0].Base64Data;

                // save
                return await this.service.save('parameter', obj).then((result: ResultApi) => {
                    this.processing = false;
                    if (ResultApi.IsSuccess(result)) {
                        ToastrHelper.Success('Save parameter success');
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