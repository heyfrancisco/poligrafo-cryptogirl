# Poligrafo da Crypto Girl 📊💱

## Descrição

O Poligrafo da Crypto Girl é uma aplicação web que permite simular ganhos mensais com base nos sinais de trading partilhados pela [@Cryptogirl.pt](https://www.instagram.com/cryptogirl.pt/). A aplicação permite comparar diferentes estratégias de alavancagem e calcular o crescimento potencial de uma carteira de investimento.

## Funcionalidades Principais

- Simulação de crescimento de bankroll com diferentes níveis de alavancagem (1x, 5x, 10x)
- Personalização do investimento inicial
- Ajuste da percentagem de bankroll por trade
- Seleção de mês para análise
- Visualização gráfica da evolução do investimento
- Cálculo de retorno para cada estratégia de alavancagem

## Tecnologias Utilizadas

- Next.js
- React
- Recharts (para visualização de dados)
- Tailwind CSS
- TypeScript

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## Instalação

1. Clonar o repositório
```bash
git clone https://github.com/seu-username/calculadora-crypto.git
```

2. Instalar dependências
```bash
cd calculadora-crypto
npm install
# ou
yarn install
```

3. Iniciar o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

## Configuração

A aplicação utiliza um ficheiro `trades.json` localizado em `/lib/trades.json` para armazenar os dados históricos de trades. Certifique-se de que este ficheiro está corretamente configurado com os dados dos trades.

## Como Utilizar

1. Selecione o mês que pretende analisar
2. Insira o valor do investimento inicial
3. Ajuste a percentagem da banca por trade
4. Observe a simulação de crescimento para diferentes níveis de alavancagem

## Avisos Importantes

⚠️ **Nota:** A simulação utiliza **apenas o 1º Alvo** fornecido pela Crypto Girl, considerando stop loss total em casos de perda. Os resultados apresentados são baseados em dados históricos e podem variar significativamente dependendo da estratégia de saída e das condições de mercado.

## Contribuições

Contribuições são bem-vindas! Por favor, abra um issue ou submeta um pull request.