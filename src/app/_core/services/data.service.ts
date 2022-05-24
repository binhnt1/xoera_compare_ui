import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { IpDto } from '../domains/objects/ip.dto';
import { ResultApi } from '../domains/data/result.api';
import { ResultType } from '../domains/enums/result.type';

@Injectable({ providedIn: 'root' })
export class DataService {
    connection: any;
    countryIp: IpDto;

    // menu
    activeMenuAside: boolean = false;
    activeMenuHeader: boolean = false;

    constructor(private service: ApiService) {
        
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
