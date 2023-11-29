import {UUID} from 'uuid'
import {BaseEvent} from '../base-event'

export class StorageRegisteredEvent extends BaseEvent {
  constructor(
    public readonly aggregateId: UUID,
    public readonly capacity: number,
  ) {
    super()
  }
}

export class StorageDisabledEvent extends BaseEvent {
  constructor(
    public readonly aggregateId: UUID,
    public readonly disabledCapacity: number,
  ) {
    super()
  }
}
