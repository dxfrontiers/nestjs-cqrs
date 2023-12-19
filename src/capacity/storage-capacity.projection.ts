import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {StorageDisabledEvent, StorageEnabledEvent, StorageRegisteredEvent} from '../storage/storage.events';

@EventsHandler(StorageRegisteredEvent, StorageDisabledEvent, StorageEnabledEvent)
export class StorageCapacityProjection implements IEventHandler<StorageRegisteredEvent | StorageDisabledEvent | StorageEnabledEvent> {
  private currentStorageCapacity: number = 0;

  constructor() {
    console.log('StorageCapacityProjection instance created:', this);
  }

  handle(event: StorageRegisteredEvent | StorageDisabledEvent | StorageEnabledEvent): void {
    if (event instanceof StorageRegisteredEvent) {
      this.handleStorageRegistered(event);
    } else if (event instanceof StorageDisabledEvent) {
      this.handleStorageDisabled(event);
    } else if (event instanceof StorageEnabledEvent) {
      this.handleStorageEnabled(event);
    }
  }

  handleStorageRegistered(event: StorageRegisteredEvent) {
    const capacity = parseInt(event.capacity, 10);
    this.currentStorageCapacity += capacity;
    console.log("currentStorageCapacity", this.currentStorageCapacity)
  }

  handleStorageDisabled(event: StorageDisabledEvent) {
    const capacity = parseInt(event.capacity, 10);
    this.currentStorageCapacity -= capacity;
    console.log("currentStorageCapacity", this.currentStorageCapacity)
  }

  handleStorageEnabled(event: StorageEnabledEvent) {
    const capacity = parseInt(event.capacity, 10);
    this.currentStorageCapacity += capacity;
    console.log("currentStorageCapacity", this.currentStorageCapacity)
  }
}
