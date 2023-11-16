import {Type} from './enum'

export class ProducerDto {
  readonly id: string
  readonly type: Type
  readonly capacity: number
}
