import {Type} from './enum'
import {IsNumber} from 'class-validator'

export class ProducerDto {
  readonly id: string
  readonly type: Type
  @IsNumber()
  readonly capacity: number
}

export class StorageUnitDto {
  readonly id: string
  @IsNumber()
  readonly capacity: number
}
