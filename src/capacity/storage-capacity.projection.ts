import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {StorageDisabledEvent, StorageRegisteredEvent} from '../storage/storage.events';

@EventsHandler(StorageRegisteredEvent, StorageDisabledEvent)
export class StorageCapacityProjection implements IEventHandler<StorageRegisteredEvent | StorageDisabledEvent> {
  private currentStorageCapacity: number = 0;

  handle(event: StorageRegisteredEvent | StorageDisabledEvent): void {
    console.log('Storage Capacity', this.currentStorageCapacity)
    if (event instanceof StorageRegisteredEvent) {
      this.handleStorageRegistered(event);
    } else if (event instanceof StorageDisabledEvent) {
      this.handleStorageDisabled(event);
    }
  }

  /**
   * Eventhandler for our storage events
   * Event requires to include the capacity/disabled capacity information
   * @param event
   */

  handleStorageRegistered(event: StorageRegisteredEvent) {
    this.currentStorageCapacity += event.capacity;
  }

  handleStorageDisabled(event: StorageDisabledEvent) {
    this.currentStorageCapacity -= event.capacity;
  }
}
