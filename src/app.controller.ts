import {Body, Controller, Get, Post, Res} from '@nestjs/common'
import {Response} from 'express'
import {ProducerService} from './producer/producer.service'
import {ProducerDto} from './producer/dto'
import {Type} from './producer/enum'

@Controller()
export class AppController {
  constructor(private readonly producerService: ProducerService) {}
  @Get()
  renderForm(@Res() res: Response) {
    const typesOptions = Object.values(Type)
      .map((type) => `<option value="${type}">${type}</option>`)
      .join('')

    const html = `
      <h1>Add new producer</h1>
      <form id="producerForm" action="/" method="POST">
        <label for="name">Address</label>
        <input name="name" />
        
        <label for="type">Type</label>
        <select name="type">
          ${typesOptions}
        </select>
        
        <label for="capacity">Capacity per Minute</label>
        <input name="capacity" type="number">

        <button type="submit">Add</button>
      </form>
      
      <script>
        document.getElementById('producerForm').addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(this);
          fetch('/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams([...formData]).toString()
          })
          .then(response => {
            console.log('Form submitted successfully');
          })
          .catch(error => console.error('Error:', error));
        });
      </script>
    `
    res.send(html)
  }

  @Post()
  async handleFormSubmit(
    @Body() producerDto: ProducerDto,
    @Res() res: Response,
  ) {
    console.log(producerDto)
    await this.producerService.createProducer(producerDto)
    res.send('Producer erfolgreich erstellt')
  }
}
