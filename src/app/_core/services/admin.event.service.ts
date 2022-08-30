import { Injectable, EventEmitter } from '@angular/core';
import { ObjectEx } from '../decorators/object.decorator';
import { NotifyEntity } from '../domains/entities/notify.entity';

@Injectable({ providedIn: 'root' })
export class AdminEventService {
    public HideCombobox: EventEmitter<any> = new EventEmitter<any>();
    public Validate: EventEmitter<ObjectEx> = new EventEmitter<ObjectEx>();
    public ResetValidate: EventEmitter<ObjectEx> = new EventEmitter<ObjectEx>();
    public RefreshGrids: EventEmitter<NotifyEntity> = new EventEmitter<NotifyEntity>();
    public RefreshItems: EventEmitter<{property: string, value: any}> = new EventEmitter<{property: string, value: any}>();
}
