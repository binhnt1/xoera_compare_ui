import { HubFileService } from "../../hubfile.service";
import { AppInjector } from "../../../../../app.module";
import { Component, OnInit, ViewChild } from "@angular/core";
import { validation } from "../../../../../_core/decorators/validator";
import { ResultApi } from "../../../../../_core/domains/data/result.api";
import { ToastrHelper } from "../../../../../_core/helpers/toastr.helper";
import { EditorComponent } from "../../../../../_core/editor/editor.component";
import { UploadHubFileData } from "../../../../../_core/domains/entities/hubfile.entity";

@Component({
    templateUrl: "./upload.file.component.html",
    styleUrls: ["./upload.file.component.scss"]
})
export class UploadFileComponent implements OnInit {
    errorMessage: string;
    service: HubFileService;

    item: UploadHubFileData = new UploadHubFileData();
    @ViewChild('uploadFile') uploadFile: EditorComponent;

    constructor() {
        this.service = AppInjector.get(HubFileService);
    }

    async ngOnInit() {
    }

    public async confirm(): Promise<boolean> {
        this.errorMessage = null;

        // upload file
        let files = await this.uploadFile.upload();
        this.item.Files = files && files.length > 0 ? files.map(c => { return c.Path }) : null;

        let valid = await validation(this.item);
        if (valid) {
            return await this.service.uploadFile(this.item).then((result: ResultApi) => {
                if (ResultApi.IsSuccess(result)) {
                    ToastrHelper.Success("Upload file success, system will automatic process files");
                    return true;
                } else {
                    this.errorMessage = result && result.Description;
                    return false;
                }
            }, (e) => {
                ToastrHelper.Exception(e);
                return false;
            });
        }
        return false;
    }
}