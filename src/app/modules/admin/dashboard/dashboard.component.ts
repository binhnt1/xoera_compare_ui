import * as _ from 'lodash';
import { Component } from '@angular/core';
import { AdminEventService } from '../../../_core/services/admin.event.service';

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {    
    constructor(public event: AdminEventService) {
    }
}
