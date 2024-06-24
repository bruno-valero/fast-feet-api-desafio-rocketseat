import { Recipient } from '@/domain/core/deliveries-and-orders/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RecipientPresenter {
  async present(recipient: Recipient) {
    return {
      name: recipient.name,
      id: recipient.id.value,
      cpf: recipient.cpf.format,
    }
  }
}
