import {EventsHandler, IEventHandler} from '@nestjs/cqrs'
import {BaseEvent} from '../base-event'

@EventsHandler(BaseEvent)
export class LoggingEventHandler implements IEventHandler<BaseEvent> {
  handle(event: BaseEvent) {
    console.log('Event received:', event)
  }
}
