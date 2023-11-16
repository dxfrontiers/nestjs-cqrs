import {Body, Controller, Post} from '@nestjs/common'
import {ProducerService} from './producer.service'
import {ProducerDto} from './dto'

@Controller('producer')
export class ProducerController {
  constructor(private readonly producerService: ProducerService) {}

  @Post()
  async create(@Body() producerDto: ProducerDto): Promise<any> {
    return await this.producerService.createProducer(producerDto)
  }
}
