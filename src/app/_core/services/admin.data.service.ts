import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { IpDto } from '../domains/objects/ip.dto';
import { AdminApiService } from './admin.api.service';
import { ResultApi } from '../domains/data/result.api';
import { ResultType } from '../domains/enums/result.type';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
    connection: any;
    countryIp: IpDto;
    menuCollapsed: boolean;
    
    // menu
    activeMenuAside: boolean = false;
    activeMenuHeader: boolean = false;

    constructor(private service: AdminApiService) {
        
    }

    public async loadCountryIp() {
        if (!this.countryIp) {
            await this.service.ip().then((result: ResultApi) => {
                if (result && result.Type == ResultType.Success) {
                    this.countryIp = result.Object as IpDto;
                }
            });
        }
    }
}
