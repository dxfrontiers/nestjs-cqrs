import {Injectable} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {ProducerDto} from './dto'
import {AddProducerCommand} from './commands'

@Injectable()
export class ProducerService {
  constructor(private readonly commandBus: CommandBus) {}

  async createProducer(producer: ProducerDto) {
    return await this.commandBus.execute(new AddProducerCommand(producer))
  }
}
