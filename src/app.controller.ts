import {Body, Controller, Get, Post, Res} from '@nestjs/common'
import {Response} from 'express'
import {StorageUnitService} from './participants/storageUnit.service'
import {ProducerService} from './participants/producer.service'
import {ProducerDto, StorageUnitDto} from './participants/dto'
import {Type} from './participants/enum'

@Controller()
export class AppController {
  constructor(
    private readonly producerService: ProducerService,
    private readonly storageUnitService: StorageUnitService,
  ) {}
  @Get()
  renderForm(@Res() res: Response) {
    const typesOptions = Object.values(Type)
      .map((type) => `<option value="${type}">${type}</option>`)
      .join('')

    const html = `
      <h1>Add new producer</h1>
      <form id="producer-form" action="/create-producer" method="POST">
        <label for="type">Type</label>
        <select name="type">
          ${typesOptions}
        </select>
        
        <label for="capacity">Capacity per Minute</label>
        <input name="capacity" type="number">

        <button type="submit">Add</button>
      </form>
      
      <h1>Add new stroage unit</h1>
      <form id="storage-unit-form" action="/create-storage-unit" method="POST">
        <label for="capacity">Capacity</label>
        <input name="capacity" type="number">

        <button type="submit">Add</button>
      </form>
    `
    res.send(html)
  }

  @Post('/create-producer')
  async handleProducerFormSubmit(
    @Body() producerDto: ProducerDto,
    @Res() res: Response,
  ) {
    console.log(producerDto)
    await this.producerService.createProducer(producerDto)
    res.send('Producer erfolgreich erstellt')
  }

  @Post('/create-storage-unit')
  async handleStorageUnitFormSubmit(
    @Body() storageUnitDto: StorageUnitDto,
    @Res() res: Response,
  ) {
    console.log(storageUnitDto)
    await this.storageUnitService.createStorageUnit(storageUnitDto)
    res.send('Storage Unit erfolgreich erstellt')
  }
}
