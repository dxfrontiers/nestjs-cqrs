import {
  CommandHandler,
  EventPublisher,
  EventsHandler,
  ICommandHandler,
  IEventHandler,
} from '@nestjs/cqrs'
import {AddProducerCommand} from './commands'
import {ProducerRepository} from './repositories'
import {ProducerCreatedEvent} from './events'
import {client as eventStore} from '../eventstore'
import {jsonEvent} from '@eventstore/db-client'

@CommandHandler(AddProducerCommand)
export class AddProducerHandler implements ICommandHandler<AddProducerCommand> {
  constructor(
    private readonly producerRepository: ProducerRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AddProducerCommand): Promise<void> {
    const producer = this.publisher.mergeObjectContext(
      await this.producerRepository.createProducer(command.producerDto),
    )
    producer.commit()
  }
}

@EventsHandler(ProducerCreatedEvent)
export class ProducerCreatedEventHandler
  implements IEventHandler<ProducerCreatedEvent>
{
  async handle(event: ProducerCreatedEvent): Promise<void> {
    const eventData = jsonEvent({
      type: 'ProducerCreated',
      data: {
        id: event.data.id,
        type: event.data.type,
        capacity: event.data.capacity,
      },
    })

    await eventStore.appendToStream('producer-stream', [eventData])
  }
}
