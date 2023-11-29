// storage-capacity.projection.ts
import {EventsHandler} from '@nestjs/cqrs'
import {
  StorageDisabledEvent,
  StorageRegisteredEvent,
} from '../storage/StorageEvents'

@EventsHandler(StorageRegisteredEvent, StorageDisabledEvent)
export class StorageCapacityProjection {
  private currentStorageCapacity: number = 0

  handleStorageRegistered(event: StorageRegisteredEvent) {
    this.currentStorageCapacity += event.capacity
  }

  handleStorageDisabled(event: StorageDisabledEvent) {
    this.currentStorageCapacity -= event.disabledCapacity
  }
}
