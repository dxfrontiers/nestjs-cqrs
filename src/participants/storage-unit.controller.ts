import {Body, Controller, Post} from '@nestjs/common'
import {StorageUnitService} from './storage-unit.service'
import {StorageUnitDto} from './dto'

@Controller('storageUnit')
export class StorageUnitController {
  constructor(private readonly storageUnitService: StorageUnitService) {}

  @Post()
  async create(@Body() storageUnitDto: StorageUnitDto): Promise<any> {
    return await this.storageUnitService.createStorageUnit(storageUnitDto)
  }
}
