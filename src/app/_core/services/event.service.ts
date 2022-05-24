import { Injectable, EventEmitter } from '@angular/core';
import { AdminEventService } from './admin.event.service';

@Injectable({ providedIn: 'root' })
export class EventService extends AdminEventService {
}
