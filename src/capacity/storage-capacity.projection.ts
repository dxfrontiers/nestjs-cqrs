import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {StorageDisabledEvent, StorageRegisteredEvent} from '../storage/storage.events';

@EventsHandler(StorageRegisteredEvent, StorageDisabledEvent)
export class StorageCapacityProjection implements IEventHandler<StorageRegisteredEvent | StorageDisabledEvent> {
  private currentStorageCapacity: number = 0;

  handle(event: StorageRegisteredEvent | StorageDisabledEvent): void {
    if (event instanceof StorageRegisteredEvent) {
      this.handleStorageRegistered(event);
    } else if (event instanceof StorageDisabledEvent) {
      this.handleStorageDisabled(event);
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
}
