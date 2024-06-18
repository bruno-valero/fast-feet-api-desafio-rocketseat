# FastFeet API - Desafio Rocketseat

[![Typescript Badge](https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=007acd&link=https://gist.github.com/bruno-valero/302a8b36f8fb5749bd15866b523b315e)](https://gist.github.com/bruno-valero/302a8b36f8fb5749bd15866b523b315e)
[![NodeJS Badge](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=68a063&link=https://gist.github.com/bruno-valero/9c4167a53b05049712ee0333c5664904)](https://gist.github.com/bruno-valero/9c4167a53b05049712ee0333c5664904)
[![NestJS Badge](https://img.shields.io/badge/Nest.js-20232A?style=for-the-badge&logo=nestjs&logoColor=f00057&link=https://gist.github.com/bruno-valero/9c790eee84ac5cecbf41962c79098f9d)](https://gist.github.com/bruno-valero/9c790eee84ac5cecbf41962c79098f9d)

Nesse desafio desenvolveremos uma API para controle de encomendas de uma transportadora fictícia, a FastFeet.

Confira o enunciado do desafio no [Notion](https://efficient-sloth-d85.notion.site/Desafio-04-a3a2ef9297ad47b1a94f89b197274ffd)

## Etapa Atual

- Entities

  - deliver domain entities
    - [x] administrator (adm)
    - [x] attachment (para enviar o foto ao entregar a encomenda)
    - [x] courier (entregador)
    - [x] order attachment (ligação entre os attachments e uma order)
    - [x] order (encomenda)
    - [x] recipient (destinatário)
    - [x] update adm (registros do update de um adm)
    - [x] update courier (registros do update de um entregador)
    - [x] update order (registros do update de uma encomenda)
    - [x] update recipient (registros do update de um destinatário)
  - notification domain entities
    - [x] notification

- Use Cases

  - deliver domain use cases
    - [x] authentication and users register
      - [x] adm
        - [x] authenticate adm
      - [x] courier
        - [x] register courier
        - [x] authenticate courier
      - [x] recipient
        - [x] register recipient
        - [x] authenticate recipient
    - [x] other actions
      - [x] courier
        - [x] delete courier
        - [x] fech couriers
        - [x] find courier
        - [x] update courier password
        - [x] delete courier
      - [x] recipient
        - [x] delete recipient
        - [x] fech recipients
        - [x] find recipient
        - [x] update recipient password
        - [x] delete recipient
      - [x] order
        - [x] collect order
        - [x] create order
        - [x] delete order
        - [x] deliver order
        - [x] fetch orders
        - [x] fetch recipient orders
        - [x] fetch courier orders
        - [x] fetch nearby orders
        - [x] find order
        - [x] mark order as awaiting for pickup
        - [x] return order
  - notification domain use cases
    - [x] read notification
    - [x] send notification

- Events
  - [x] on order awaiting for pickup (when an order is ready and awaiting for a courier to pick it up)
  - [x] on order courier accept (when a courier accepts deliver an order)
  - [x] on order courier cancelled (when a courier cancels de delivery of an order)
  - [x] on order courier collected (when a courier collects an order that is awaiting to be picked up)
  - [x] on order courier deliver (when a courier delivers an order to it's recipient)
  - [x] on order returned (when a recipient returns an order after receiving it)

### Requisitos Funcionais

- [ ] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [ ] Deve ser possível realizar login com CPF e Senha
- [ ] Deve ser possível realizar o CRUD dos entregadores
- [ ] Deve ser possível realizar o CRUD das encomendas
- [ ] Deve ser possível realizar o CRUD dos destinatários
- [ ] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [ ] Deve ser possível retirar uma encomenda
- [ ] Deve ser possível marcar uma encomenda como entregue
- [ ] Deve ser possível marcar uma encomenda como devolvida
- [ ] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- [ ] Deve ser possível alterar a senha de um usuário
- [ ] Deve ser possível listar as entregas de um usuário
- [ ] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de Negócio

- [ ] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [ ] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [ ] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [ ] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [ ] Somente o admin pode alterar a senha de um usuário
- [ ] Não deve ser possível um entregador listar as encomendas de outro entregador

### Requisitos Não Funcionais

- [ ]
