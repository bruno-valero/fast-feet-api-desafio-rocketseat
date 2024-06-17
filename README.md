# FastFeet API - Desafio Rocketseat

Nesse desafio desenvolveremos uma API para controle de encomendas de uma transportadora fictícia, a FastFeet.

Confira o enunciado do desafio no [Notion](https://efficient-sloth-d85.notion.site/Desafio-04-a3a2ef9297ad47b1a94f89b197274ffd)

## Etapa Atual

- As entidades de domínio foram criadas

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

- Os use cases que foram criados
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
    - [ ] order
      - processo inicializado (em andamento)

## O que fazer a seguir?

Terminar o os use cases relacionados às orders (encomendas) e realizar os testes para validar o funcionamento

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
