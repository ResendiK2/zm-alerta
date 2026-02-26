Read PROJECT_RULES.md and follow it strictly.

You are implementing the UI of a mobile-first crisis collaborative map application.

The goal is to reproduce EXACTLY the following 5 screens.
Do not redesign. Do not simplify. Do not introduce new UX ideas.
Only implement what is described.

The UI must look like a mobile application even when running on web.

GENERAL LAYOUT RULES (APPLY TO ALL SCREENS)

- Mobile-first layout
- Full height app container
- Flex column layout
- Header fixed at top
- Bottom navigation fixed at bottom
- Content area between them
- Map or content NEVER fullscreen absolute
- Use overlays instead of page navigation whenever specified
- Large touch-friendly buttons
- Minimal text inputs (almost none)

--------------------------------------------------
SCREEN 1 — MAP VIEW (MAIN SCREEN)
--------------------------------------------------

Structure:

Top Header (fixed height)
- Left: app logo icon
- Title text: "SOS JF"
- Right: help icon button (question mark)

Main Area:
- Interactive MapLibre map
- Map centered on user geolocation
- User location shown as blue dot

Map Elements:

Environmental events:
- Rendered as semi-transparent colored circles
  - alagamento → blue
  - deslizamento → brown
  - falta_energia → yellow

Human events:
- Rendered as markers with labels
  - pessoa_risco → red alert marker
  - abrigo → green home marker

Right Floating Controls (vertical stack):
- Button 1: shield icon (filters shelters)
- Button 2: location arrow (recenter map to user)

Bottom Left Overlay:
- Legend card explaining colors and icons
- Semi-transparent background
- Floating above map

Primary Floating Action Button:
- Large rounded blue button
- Text: "+ REPORTAR"
- Positioned above bottom navigation
- Opens reporting flow (NOT a new page)

Bottom Navigation Bar:
- Tab 1: "Mapa" (active)
- Tab 2: "Meus Alertas"

--------------------------------------------------
SCREEN 2 — REPORT FLOW STEP 1 (SELECT TYPE)
--------------------------------------------------

Opened as a bottom sheet modal from Screen 1.

Top area:
- Progress indicator text: "Passo 1 de 3"
- Title: "Selecionar ocorrência"

Scrollable list of selectable cards.

Each card contains:
- Colored icon
- Title
- Short description

Options:

1. Alagamento
2. Deslizamento
3. Falta de Energia
4. Pessoa em Risco
5. Abrigo Disponível

Behavior:
- Only one selectable at a time
- Selected card highlights
- Bottom button:
  "Continuar"

No text inputs allowed.

--------------------------------------------------
SCREEN 3 — REPORT FLOW STEP 2 (CONFIRM LOCATION)
--------------------------------------------------

Bottom sheet continues.

Top:
- "Passo 2 de 3"
- Title: "Confirmar localização"

Content:
- Small embedded map preview centered on detected GPS
- Pin marker in center

Buttons:
- "Usar minha localização atual"
- "Voltar"

Location automatically detected.

--------------------------------------------------
SCREEN 4 — REPORT FLOW STEP 3 (CONFIRM SUBMISSION)
--------------------------------------------------

Bottom sheet final step.

Top:
- "Passo 3 de 3"
- Title: "Confirmar envio"

Content:
- Selected occurrence type
- Location confirmation text
- Warning text explaining report expiration

Primary button:
"Enviar alerta"

Secondary:
"Voltar"

After submission:
- Close modal
- Return to map
- New marker appears immediately

--------------------------------------------------
SCREEN 5 — MY ALERTS SCREEN
--------------------------------------------------

Opened via Bottom Navigation tab.

Header remains identical.

Content area:
List of alerts created by current device only.

Each list item shows:
- Icon
- Type name
- Time created
- Remaining time until expiration

Right side:
Delete button icon.

Behavior:
- Deleting removes alert immediately from map.

Empty state:
Centered message:
"Você ainda não criou alertas."

--------------------------------------------------
INTERACTION RULES

- No page reloads.
- Use local state or minimal state management.
- Map must remain mounted when modals open.
- Bottom sheets slide from bottom.
- Overlays must not block header or navigation.

--------------------------------------------------
STYLE GUIDELINES

- Rounded corners
- Soft shadows
- High contrast for emergency readability
- Accessible tap targets
- Clean modern mobile UI

--------------------------------------------------
IMPORTANT CONSTRAINTS

DO NOT:
- introduce authentication
- create extra navigation routes
- redesign layouts
- create additional screens
- use fullscreen absolute map

Generate components necessary to implement these five screens while respecting PROJECT_RULES.md.
Explain file structure BEFORE generating code.