import { Courier } from '@/domain/core/deliveries-and-orders/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CourierPresenter {
  async present(courier: Courier) {
    return {
      name: courier.name,
      id: courier.id.value,
      cpf: courier.cpf.format,
    }
  }
}
