# Design: Gráfico de Barras - Pomodoros por Dia

## Visão Geral
Adicionar gráfico de barras mostrando a quantidade de pomodoros concluídos por dia da semana.

## Objetivos
- Visualizar produtividade semanal
- Motivar usuário com progresso visual
- Complementar estatísticas existentes

## Especificação

### UI/UX
- **Posição**: Abaixo da seção "Estatísticas" existente
- **Título**: "📈 Produtividade Semanal"
- **Gráfico**: Barras verticais para cada dia (segunda a domingo)
- **Barras atuais**: Destacar dia de hoje
- **Interação**: Tooltip ao hover mostrando valor exato
- **Responsivo**: Ajustar largura em telas menores

### Dados
- **Período**: Semana atual (segunda a domingo)
- **Fonte**: Dados existentes de pomodoros (localStorage)
- **Atualização**: Tempo real ao completar pomodoro

### Tema
- Respeitar tema claro/escuro atual
- Cores consistentes com design existente

## Tecnologias
- Chart.js (via CDN) - biblioteca leve e popular

## Implementação
1. Adicionar CDN do Chart.js no HTML
2. Criar elemento canvas para o gráfico
3. Implementar lógica para buscar dados dos últimos 7 dias
4. Integrar com sistema de temas
5. Atualizar gráfico ao completar pomodoro
