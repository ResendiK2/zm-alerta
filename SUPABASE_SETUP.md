# Configuração do Supabase

Este guia mostra como configurar o banco de dados Supabase para sincronizar alertas entre dispositivos.

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Node.js 18+ instalado

## 🚀 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha um nome para o projeto (ex: `zm-alerta`)
4. Defina uma senha forte para o banco de dados
5. Escolha a região mais próxima (ex: South America)
6. Aguarde a criação do projeto (~2 minutos)

### 2. Obter Credenciais

Após a criação do projeto:

1. No dashboard do Supabase, vá em **Settings** > **API**
2. Copie os seguintes valores:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública para uso no frontend)

### 3. Configurar Variáveis de Ambiente

1. Na raiz do projeto, copie o arquivo de exemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edite `.env.local` e adicione suas credenciais:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
   
   # Configuração de Polling (opcional)
   NEXT_PUBLIC_ALERTS_POLLING_INTERVAL=30000  # Em milissegundos (30 segundos)
   ```

⚠️ **Importante**: O arquivo `.env.local` não deve ser commitado no git (já está no `.gitignore`)

**Sobre o Polling:**
- O sistema busca novos alertas automaticamente a cada 30 segundos (padrão)
- Isso garante que alertas apareçam mesmo se o Realtime falhar
- Defina como `0` para desabilitar o polling (apenas Realtime)
- Valores recomendados: entre 10000 (10s) e 60000 (60s)

### 4. Criar Tabela de Alertas

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie e cole o conteúdo do arquivo `supabase/migrations/001_create_alerts_table.sql`
4. Clique em "Run" para executar o script

Ou, se preferir, execute via linha de comando:

```bash
# Instale o Supabase CLI (se ainda não tiver)
npm install -g supabase

# Faça login
supabase login

# Conecte ao seu projeto
supabase link --project-ref seu-project-ref

# Execute a migração
supabase db push
```

### 5. Habilitar Realtime

Por padrão, o Realtime já está habilitado para a tabela `alerts` através do script SQL. Mas você pode verificar:

1. No dashboard, vá em **Database** > **Replication**
2. Certifique-se de que a tabela `alerts` está na lista de "Realtime enabled tables"
3. Se não estiver, clique em "Add table" e selecione `alerts`

### 6. Testar a Conexão

1. Inicie o servidor de desenvolvimento:
   ```bash
   yarn dev
   ```

2. Abra `http://localhost:3000` no navegador
3. Abra o Console de Desenvolvedor (F12)
4. Você deve ver logs como:
   ```
   📡 Configurando Supabase Realtime...
   📡 Status da inscrição Realtime: SUBSCRIBED
   ```

5. Crie um alerta e verifique se ele aparece em outro dispositivo/navegador

## ✅ Verificação

Para verificar se tudo está funcionando:

1. Abra a aplicação em dois navegadores diferentes (ou em dois dispositivos)
2. Crie um alerta em um dos navegadores
3. O alerta deve aparecer automaticamente no outro navegador em tempo real

## 🔍 Estrutura da Tabela

A tabela `alerts` tem a seguinte estrutura:

| Coluna       | Tipo           | Descrição                                    |
|-------------|----------------|----------------------------------------------|
| id          | UUID           | Identificador único (gerado automaticamente) |
| type        | TEXT           | Tipo do alerta (alagamento, deslizamento, etc) |
| latitude    | DOUBLE PRECISION | Latitude da localização                   |
| longitude   | DOUBLE PRECISION | Longitude da localização                  |
| created_at  | TIMESTAMPTZ    | Data de criação (automática)                |
| expires_at  | TIMESTAMPTZ    | Data de expiração (24h após criação)        |

## 🔒 Segurança

O sistema usa Row Level Security (RLS) com as seguintes políticas:

- **Leitura**: Todos podem ler alertas não expirados
- **Inserção**: Todos podem criar novos alertas
- **Deleção**: Todos podem deletar alertas

⚠️ **Para produção**, considere adicionar autenticação e restringir essas políticas.

## 🌐 Modo Offline

O sistema tem suporte a modo offline:

- Se o Supabase não estiver acessível, os alertas são salvos no `localStorage`
- Quando a conexão é restaurada, os alertas do `localStorage` são carregados
- Alertas criados offline terão IDs começando com `local-` e não serão sincronizados

## 🐛 Resolução de Problemas

### Erro: "Invalid API key"
- Verifique se copiou a chave correta do Supabase
- Certifique-se de usar a chave **anon public**, não a service_role

### Erro: "relation 'public.alerts' does not exist"
- A tabela não foi criada. Execute o script SQL novamente

### Realtime não funciona
- Verifique se habilitou Realtime para a tabela `alerts`
- Verifique o console do navegador para erros de conexão
- Certifique-se de que seu projeto Supabase está na versão mais recente

### Alertas não aparecem em outros dispositivos
- Verifique se está usando o mesmo projeto Supabase em todos os dispositivos
- Abra o console do navegador e procure por erros
- Verifique se o Realtime está conectado (status: SUBSCRIBED)

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
