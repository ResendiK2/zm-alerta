# Configuração de Tempos de Expiração

Este documento explica como funcionam os tempos de expiração dos alertas e como configurá-los.

## 📋 Tempos Padrão

Cada tipo de alerta tem um tempo de expiração específico, otimizado para sua natureza:

| Tipo de Alerta | Tempo Padrão | Milissegundos | Justificativa |
|---|---|---|---|
| 🚨 Pessoa em Risco | 6 horas | 21600000 | Situação urgente que deve ser resolvida rapidamente |
| 💧 Alagamento | 8 horas | 28800000 | Água geralmente recua em algumas horas |
| ⚡ Falta de Energia | 12 horas | 43200000 | Tempo médio de reparo |
| ⛰️ Deslizamento | 48 horas | 172800000 | Risco persiste por mais tempo |
| 🏠 Abrigo | 7 dias | 604800000 | Recurso de longo prazo |

## 🔧 Personalização

Você pode personalizar esses tempos editando o arquivo `.env.local`:

```env
# Pessoa em Risco (6 horas)
NEXT_PUBLIC_ALERT_EXPIRATION_PESSOA_RISCO=21600000

# Alagamento (8 horas)
NEXT_PUBLIC_ALERT_EXPIRATION_ALAGAMENTO=28800000

# Falta de Energia (12 horas)
NEXT_PUBLIC_ALERT_EXPIRATION_FALTA_ENERGIA=43200000

# Deslizamento (48 horas / 2 dias)
NEXT_PUBLIC_ALERT_EXPIRATION_DESLIZAMENTO=172800000

# Abrigo (7 dias)
NEXT_PUBLIC_ALERT_EXPIRATION_ABRIGO=604800000
```

## 🧮 Calculando Milissegundos

Use estas fórmulas para converter tempo em milissegundos:

### Horas
```
horas × 60 × 60 × 1000
```

Exemplos:
- 1 hora = `1 × 60 × 60 × 1000` = 3600000
- 6 horas = `6 × 60 × 60 × 1000` = 21600000
- 12 horas = `12 × 60 × 60 × 1000` = 43200000
- 24 horas = `24 × 60 × 60 × 1000` = 86400000

### Dias
```
dias × 24 × 60 × 60 × 1000
```

Exemplos:
- 1 dia = `1 × 24 × 60 × 60 × 1000` = 86400000
- 2 dias = `2 × 24 × 60 × 60 × 1000` = 172800000
- 7 dias = `7 × 24 × 60 × 60 × 1000` = 604800000

### Ferramenta Online

Use o Node.js para calcular rapidamente:

```bash
node -e "console.log(6 * 60 * 60 * 1000)"  # 6 horas
node -e "console.log(2 * 24 * 60 * 60 * 1000)"  # 2 dias
```

## 📝 Exemplos de Configuração

### Cidade Pequena (tempos menores)
```env
NEXT_PUBLIC_ALERT_EXPIRATION_PESSOA_RISCO=10800000      # 3 horas
NEXT_PUBLIC_ALERT_EXPIRATION_ALAGAMENTO=14400000         # 4 horas
NEXT_PUBLIC_ALERT_EXPIRATION_FALTA_ENERGIA=21600000     # 6 horas
NEXT_PUBLIC_ALERT_EXPIRATION_DESLIZAMENTO=86400000      # 24 horas
NEXT_PUBLIC_ALERT_EXPIRATION_ABRIGO=259200000           # 3 dias
```

### Região Propensa a Desastres (tempos maiores)
```env
NEXT_PUBLIC_ALERT_EXPIRATION_PESSOA_RISCO=43200000       # 12 horas
NEXT_PUBLIC_ALERT_EXPIRATION_ALAGAMENTO=43200000         # 12 horas
NEXT_PUBLIC_ALERT_EXPIRATION_FALTA_ENERGIA=86400000     # 24 horas
NEXT_PUBLIC_ALERT_EXPIRATION_DESLIZAMENTO=259200000     # 3 dias
NEXT_PUBLIC_ALERT_EXPIRATION_ABRIGO=1209600000          # 14 dias
```

### Evento Específico (enchente prolongada)
```env
NEXT_PUBLIC_ALERT_EXPIRATION_PESSOA_RISCO=21600000       # 6 horas
NEXT_PUBLIC_ALERT_EXPIRATION_ALAGAMENTO=172800000        # 48 horas (2 dias)
NEXT_PUBLIC_ALERT_EXPIRATION_FALTA_ENERGIA=86400000     # 24 horas
NEXT_PUBLIC_ALERT_EXPIRATION_DESLIZAMENTO=259200000     # 3 dias
NEXT_PUBLIC_ALERT_EXPIRATION_ABRIGO=1209600000          # 14 dias
```

## ⚙️ Como Funciona

1. **Variáveis de Ambiente**: Ao criar um alerta, o sistema verifica se existe uma variável ENV específica
2. **Valor Padrão**: Se não houver configuração, usa o tempo padrão definido no código
3. **Validação**: Valores inválidos (não numéricos ou negativos) são ignorados
4. **Limpeza Automática**: Alertas expirados são removidos automaticamente em 3 camadas:
   - **Ao carregar**: Filtrados do localStorage e Supabase
   - **Em tempo real**: Verificação a cada 1 minuto (configurável)
   - **No polling**: A cada 30 segundos ao buscar novos alertas

### Configuração da Limpeza Automática

```env
# .env.local
NEXT_PUBLIC_ALERTS_CLEANUP_INTERVAL=60000  # 1 minuto (padrão)
```

Valores recomendados:
- `30000` (30 segundos) - Limpeza mais frequente
- `60000` (1 minuto) - Padrão, bom equilíbrio
- `300000` (5 minutos) - Limpeza menos frequente

## 🔍 Verificação

Para verificar os tempos configurados:

1. Abra o Console do navegador (F12)
2. Execute:
   ```javascript
   // Ver tempo de expiração de pessoa em risco
   console.log(process.env.NEXT_PUBLIC_ALERT_EXPIRATION_PESSOA_RISCO);
   
   // Converter para horas legível
   const ms = 21600000;
   console.log(`${ms / (60 * 60 * 1000)} horas`);
   ```

## 📚 Referência Rápida

| Unidade | Milissegundos |
|---------|---------------|
| 1 minuto | 60000 |
| 5 minutos | 300000 |
| 10 minutos | 600000 |
| 30 minutos | 1800000 |
| 1 hora | 3600000 |
| 2 horas | 7200000 |
| 6 horas | 21600000 |
| 12 horas | 43200000 |
| 24 horas | 86400000 |
| 48 horas | 172800000 |
| 3 dias | 259200000 |
| 7 dias | 604800000 |
| 14 dias | 1209600000 |
| 30 dias | 2592000000 |

## 🚨 Importante

- **Reinicie o servidor** após alterar `.env.local`
- **Limpe o cache** do navegador se os tempos não atualizarem
- **Valores muito baixos** (< 1 hora) podem sobrecarregar o sistema
- **Valores muito altos** (> 30 dias) podem acumular muitos alertas antigos
