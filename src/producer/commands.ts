import {ProducerDto} from './dto'
import {ICommand} from '@nestjs/cqrs'

export class AddProducerCommand implements ICommand {
  constructor(public readonly producerDto: ProducerDto) {}
}
