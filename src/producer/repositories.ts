import {Injectable} from '@nestjs/common'
import {Producer} from './model'
import {ProducerDto} from './dto'

@Injectable()
export class ProducerRepository {
  async createProducer(producerDto: ProducerDto) {
    const producer = new Producer()
    producer.setData(producerDto)
    producer.applyEvent()
    return producer
  }
}
