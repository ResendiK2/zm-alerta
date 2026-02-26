# SOS JF - Sistema Colaborativo de Alertas

Sistema mobile-first de mapa colaborativo para alertas de emergência desenvolvido com Next.js 14, TypeScript, Supabase e MapLibre GL JS.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Supabase** - Database
- **MapLibre GL JS** - Mapa interativo
- **Vercel** - Deployment
- **localStorage** - Armazenamento de alertas

## 📱 Funcionalidades

### 5 Telas Principais

1. **Mapa Principal** - Visualização de alertas em tempo real
2. **Report Passo 1** - Seleção do tipo de ocorrência
3. **Report Passo 2** - Confirmação de localização
4. **Report Passo 3** - Confirmação de envio
5. **Meus Alertas** - Lista de alertas criados

### Tipos de Alertas

**Eventos Ambientais** (círculos coloridos):
- 💧 Alagamento (azul)
- ⛰️ Deslizamento (marrom)
- ⚡ Falta de Energia (amarelo)

**Eventos Humanos** (marcadores):
- 🚨 Pessoa em Risco (vermelho)
- 🏠 Abrigo Disponível (verde)

### Características

- ✅ Interface mobile-first
- ✅ Geolocalização automática
- ✅ Alertas expiram em 24h
- ✅ Filtro de abrigos
- ✅ Recentrar mapa na localização do usuário
- ✅ Modal bottom sheet para reportar
- ✅ Sem autenticação necessária
- ✅ Armazenamento local

## 📋 Pré-requisitos

- Node.js 18+
- yarn ou npm
- Conta Supabase (opcional - database já preparado)

## 🔧 Instalação

1. As dependências já foram instaladas:
```bash
yarn
```

2. Configure as variáveis de ambiente (opcional):

Copie `.env.local.example` para `.env.local`:
```bash
cp .env.local.example .env.local
```

Edite `.env.local` e adicione suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Execute o projeto:
```bash
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🗂️ Estrutura do Projeto

```
app/
├── layout.tsx          # Layout raiz com metadata
├── page.tsx           # Página principal com gerenciamento de estado
└── globals.css        # Estilos mobile-first

components/
├── Header.tsx                  # Header fixo
├── BottomNavigation.tsx       # Navegação inferior com tabs
├── Map.tsx                    # Componente do mapa com marcadores
├── MapWrapper.tsx             # Wrapper para carregamento dinâmico
├── MapLegend.tsx             # Legenda flutuante
├── MapControls.tsx           # Controles flutuantes (filtro, recentralizar)
├── FloatingActionButton.tsx  # Botão "+ REPORTAR"
├── ReportModal.tsx           # Modal bottom sheet com 3 passos
└── AlertsList.tsx            # Lista de alertas do usuário

types/
├── alert.ts          # Tipos de alertas, constantes e cores
└── database.ts       # Tipos do Supabase

lib/
├── supabase.ts       # Cliente Supabase
└── localStorage.ts   # Gerenciamento de alertas no localStorage

hooks/
├── useAlerts.ts      # Hook customizado para gerenciar alertas
└── useGeolocation.ts # Hook customizado para geolocalização
```

## 🗺️ MapLibre GL JS

O mapa utiliza MapLibre GL JS com estilo demo gratuito. Os alertas são renderizados como:

- **Círculos semi-transparentes** para eventos ambientais
- **Marcadores com ícones** para eventos humanos
- **Ponto azul** para localização do usuário

## 💾 Armazenamento de Dados

Os alertas são armazenados no **localStorage** do navegador:

- Cada alerta tem ID único (timestamp + random)
- Alertas expiram automaticamente após 24 horas
- Limpeza automática de alertas expirados ao carregar
- Apenas alertas criados no dispositivo atual são exibidos em "Meus Alertas"

## 🎨 Design Mobile-First

A interface foi projetada para dispositivos móveis:

- Header fixo no topo
- Navegação inferior fixa
- Bottom sheets para fluxo de report
- Botões grandes e amigáveis ao toque
- Alto contraste para situações de emergência
- Overlays flutuantes em vez de navegação de página

## 📦 Deploy no Vercel

### Via CLI:

```bash
npm install -g vercel
vercel
```

### Via GitHub:

1. Faça push do código para o GitHub
2. Importe o projeto no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente (opcional)
4. Deploy automático!

### Variáveis de Ambiente no Vercel:

```
NEXT_PUBLIC_SUPABASE_URL (opcional)
NEXT_PUBLIC_SUPABASE_ANON_KEY (opcional)
```

## 📝 Scripts

```bash
yarn dev      # Desenvolvimento local (porta 3000)
yarn build    # Build de produção
yarn start    # Servidor de produção
yarn lint     # Linter ESLint
```

## 📖 Documentação Adicional

Consulte [PROJECT_RULES.md](PROJECT_RULES.md) para regras detalhadas do projeto e especificações das 5 telas.

## 📄 Licença

Este projeto está sob a licença MIT.
