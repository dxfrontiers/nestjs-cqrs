import {Type} from './enum'

export class ProducerDto {
  readonly id: string
  readonly type: Type
  readonly capacity: number
}

export class StorageUnitDto {
  readonly id: string
  readonly capacity: number
}
