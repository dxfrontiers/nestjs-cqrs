import {UUID} from 'uuid'
import {IEvent} from "@nestjs/cqrs";

export class StorageEvent implements IEvent {
  constructor(
      public readonly aggregateId: UUID,
      public readonly capacity: number
  ) {}
}

export class StorageRegisteredEvent extends StorageEvent {}
export class StorageDisabledEvent extends StorageEvent {}
export class StorageEnabledEvent extends StorageEvent {}

