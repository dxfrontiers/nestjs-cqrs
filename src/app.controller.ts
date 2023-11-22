import {Body, Controller, Get, Post, Res} from '@nestjs/common'
import {Response} from 'express'
import {StorageUnitService} from './participants/storage-unit.service'
import {ProducerService} from './participants/producer.service'
import {ProducerDto, StorageUnitDto} from './participants/dto'
import {Type} from './participants/enum'
import {StorageUnit} from './participants/model'
import {ReadModelService} from './participants/read-model.service'

@Controller()
export class AppController {
  constructor(
    private readonly producerService: ProducerService,
    private readonly storageUnitService: StorageUnitService,
    private readonly ReadModelService: ReadModelService,
  ) {}

  @Get()
  async renderForm(@Res() res: Response) {
    const typesOptions = Object.values(Type)
      .map((type) => `<option value="${type}">${type}</option>`)
      .join('')

    const storageUnits: StorageUnit[] =
      await this.ReadModelService.sourceAllStorageUnitCreatedEvents()

    const storageUnitsListHtml = listAllStorageUnits(storageUnits)

    const html: string = `
      <div class="container">
        <div class="forms">
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
        </div>
        <div class="network">
          ${storageUnitsListHtml}
        </div>
      </div>
      
      <script>
        document.getElementById('producer-form').addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(this);
          fetch('/create-producer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams([...formData]).toString()
          })
          .then(response => {
            console.log('Form submitted successfully');
            this.reset();
          })
          .catch(error => console.error('Error:', error));
        });
        
        document.getElementById('storage-unit-form').addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(this);
          
          fetch('/create-storage-unit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams([...formData]).toString()
          })
          .then(response => {
            console.log('Form submitted successfully');
            this.reset();
          })
          .catch(error => console.error('Error:', error));
        });
      </script>
      <style>
        .container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
      </style>
    `
    res.send(html)
  }

  @Post('/create-producer')
  async handleProducerFormSubmit(
    @Body() producerDto: ProducerDto,
    @Res() res: Response,
  ) {
    await this.producerService.createProducer(producerDto)
    res.send('Producer erfolgreich erstellt')
  }

  @Post('/create-storage-unit')
  async handleStorageUnitFormSubmit(
    @Body() storageUnitDto: StorageUnitDto,
    @Res() res: Response,
  ) {
    await this.storageUnitService.createStorageUnit(storageUnitDto)
    res.send('Storage Unit erfolgreich erstellt')
  }
}

function listAllStorageUnits(storageUnits: StorageUnit[]) {
  let html = `
    <h1>Existing Storage Units:</h1>
    <ul>`
  for (const su of storageUnits) {
    html += `
        <li>
            <div>ID: ${su.id}</div>
            <div>Capacity: ${su.capacity}</div>
            <button>Turn off</button>
            <hr />
        </li>`
  }
  html += `</ul>`

  return html
}
