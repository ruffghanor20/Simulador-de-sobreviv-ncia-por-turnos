# Simulador de Sobrevivência por Turnos 

Um jogo de sobrevivência por turnos feito com **HTML, CSS e JavaScript puro**, focado em **lógica de sistemas**, **balanceamento**, **gestão de recursos** e **tomada de decisão**.

Nesta versão, o projeto evolui para algo mais próximo de um sistema completo, com **biomas**, **eventos contextuais**, **crafting**, **objetivos secundários**, **conquistas**, **gráfico de evolução** e **save slots** usando `localStorage`.

---

## Visão geral

Neste jogo, cada turno exige uma escolha.

Você precisa administrar recursos limitados, reagir ao clima, lidar com eventos aleatórios, construir melhorias para o acampamento e sobreviver até a meta de dias definida pela dificuldade.

A proposta do projeto não é só “funcionar”, mas demonstrar:

- modelagem de regras
- estrutura de estado
- progressão por sistemas
- consequências encadeadas
- equilíbrio entre risco e recompensa

---

## Principais recursos

### Sistema de sobrevivência
- saúde
- energia
- moral
- comida
- água

### Recursos de inventário
- madeira
- sucata
- fibra
- kits médicos
- armadilhas
- nível de abrigo
- nível de fogueira

### Biomas
- **Floresta**
- **Deserto**
- **Tundra**

Cada bioma altera:
- bônus iniciais
- clima disponível
- coleta de recursos
- chance de ganhos específicos
- eventos contextuais

### Clima dinâmico
O clima muda conforme o bioma e afeta:
- desgaste diário
- coleta de água
- eficiência de caça
- eventos especiais

### Sistema de ações por turno
O jogador pode:
- descansar
- buscar água
- caçar
- coletar madeira
- forragear
- explorar
- melhorar abrigo
- acender fogueira

### Crafting
Sistema de crafting com receitas e upgrades permanentes, como:
- cantil improvisado
- lança rústica
- purificador simples
- cama de folhas
- coletor de chuva / degelo
- defumador
- armadilhas
- kit médico improvisado

### Eventos aleatórios contextuais
Os eventos não são apenas aleatórios: eles também podem variar conforme:
- bioma
- clima atual
- upgrades já construídos

Exemplos:
- viajante mercador
- rastro de ervas
- carcaça metálica
- camada de gelo fino
- clima hostil
- predador rondando
- poça suspeita

### Objetivos secundários
Além de sobreviver, o jogador pode cumprir missões internas com recompensas automáticas, como:
- chegar ao dia 5
- elevar o abrigo
- construir itens
- melhorar fogueira
- concluir crafting específico

### Conquistas
Sistema de conquistas com rastreamento de progresso, como:
- sobreviver 5 dias
- sobreviver 10 dias
- construir abrigo máximo
- caçar com consistência
- fabricar múltiplos itens
- sobreviver com saúde crítica

### Save slots
Conta com **3 slots de salvamento**, usando `localStorage`, permitindo:
- salvar manualmente
- carregar um slot específico
- limpar um slot
- manter progressos diferentes

### Gráfico de evolução
O projeto inclui um gráfico em **`canvas`** que mostra a evolução de:
- saúde
- energia
- moral

Sem bibliotecas externas.

---

## Tecnologias utilizadas

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **localStorage**
- **Canvas API**

Sem frameworks e sem dependências externas.

---

## Estrutura do projeto

```bash
survival-sim/
├── index.html
├── style.css
└── game.js