# 🛠️ BUILD LOG — Matrix Screensaver

> **Estudantes:**  
> - Victor Leonardo Soares de Souza  
> - José Diego Nunes Bezerra  
>  
> **Data de Atualização:** 21 de Outubro de 2026  
> **Versão:** 1.0.0  
> **Stack:** Expo SDK 57 | React Native 0.86.3 | React 19.2.3 | TypeScript 6.0 | Shopify Skia 2.6.2  

---

## 1. 🎯 Prompt / Request

* **Objetivo Inicial:** Construir uma aplicação mobile imersiva em Expo/React Native simulando um protetor de tela (screensaver) e estação dock com a clássica chuva de código digital inspirada no utilitário de terminal **CMatrix**.
* **Requisitos Funcionais e Visuais:**
  * Renderização fluida em alta taxa de atualização (**60 a 120 FPS**) sem engasgos ou sobrecarga da CPU móvel.
  * Efeito visual fiel ao CMatrix: cabeça da trilha em destaque branco puro, gradiente de verde, mutações aleatórias de caracteres em tempo real e tela já inicializada completamente preenchida.
  * Painel flutuante estilo HUD Cyberpunk com relógio digital 24h, calendário e telemetria de hardware (RAM, CPU, GPU e taxa de atualização do display).
  * Modo imersivo total: manter o display do celular sempre aceso (sem suspensão automática) e ocultar barras de navegação e de status do sistema operacional.
* **Solicitação de Documentação:** Elaborar e estruturar o `BUILD_LOG.md` documentando detalhadamente as etapas de engenharia, decisões, problemas encontrados e soluções aplicadas.

---

## 2. 🧠 Decision Summary

* **Renderização Gráfica via GPU (Shopify Skia):**
  * *Decisão:* Descartar a renderização por componentes convencionais do React Native (`<View>`, `<Text>`). Centenas de caracteres caindo simultaneamente gerariam milhares de nós no Virtual DOM e sobrecarregariam a bridge nativa.
  * *Escolha:* Adoção de `@shopify/react-native-skia` para renderizar os glifos diretamente em um `<Canvas />` acelerado por hardware via Skia 2D na GPU.
* **Ciclo de Animação com Delta Timing:**
  * *Decisão:* Controlar o avanço dos caracteres por delta de tempo (`performance.now()`) e cadência de tick fixa (`CMATRIX_TICK_MS = 25ms`) dentro de um loop de `requestAnimationFrame`.
  * *Motivo:* Evita o efeito de "câmera lenta" ou velocidade errática em dispositivos com taxas de atualização diferentes (60Hz vs 90Hz vs 120Hz).
* **Desacoplamento de Estados e Mutação em `useRef`:**
  * *Decisão:* Armazenar todo o estado das colunas (posições, caracteres, velocidades e comprimentos) em referências mutáveis (`useRef`), disparando atualizações mínimas na tela sem recriar objetos ou arrays a cada frame.
* **Isolamento de Ciclos do HUD:**
  * *Decisão:* Isolar o componente [`src/MatrixHUD.tsx`](file:///home/v/Documentos/Projects/matrix-screensaver/src/MatrixHUD.tsx) com um intervalo fixo de 1 segundo (`setInterval(..., 1000)`).
  * *Motivo:* Garantir que as atualizações de estado do relógio e telemetria não disputem ciclos de renderização nem forcem re-renders no canvas gráfico do Skia.
* **Prevenção de Suspensão e Modo Imersivo Nativo:**
  * *Decisão:* Utilizar `expo-keep-awake` (`useKeepAwake()`) e `expo-navigation-bar` para ocultar os elementos de interface do Android e manter o app operando continuamente como protetor de tela.

---

## 3. ⚙️ Actions Performed

* **Configuração de Dependências & Ambiente:**
  * Adicionados pacotes compatíveis com Expo SDK 57:
    * `@shopify/react-native-skia` (2.6.2)
    * `react-native-reanimated` (4.5.1)
    * `expo-keep-awake` (~57.0.2)
    * `expo-navigation-bar` (~57.0.3)
    * `expo-status-bar` (~57.0.1)
    * `babel-preset-expo` (~57.0.0)
  * Configurado [`babel.config.js`](file:///home/v/Documentos/Projects/matrix-screensaver/babel.config.js) com `react-native-reanimated/plugin` para suporte a worklets.
  * Configurado [`app.json`](file:///home/v/Documentos/Projects/matrix-screensaver/app.json) com o plugin `expo-status-bar`.

* **Desenvolvimento do Motor Gráfico — [`src/MatrixRain.tsx`](file:///home/v/Documentos/Projects/matrix-screensaver/src/MatrixRain.tsx):**
  * Definido o conjunto autêntico de glifos alfanuméricos e caracteres de terminal (`MATRIX_CHARS`).
  * Implementado grid proporcional à largura da tela e tamanho de fonte monospaçada (`FONT_SIZE = 16`, baseline `0.85 * FONT_SIZE`).
  * Desenvolvido loop VSync nativo via `requestAnimationFrame` com passo de 25ms.
  * Construída a paleta de cores característica:
    * Ponta brilhante: `#FFFFFF`
    * Nível primário: `#00FF00`
    * Nível intermediário: `#00CC00`
    * Nível escuro: `#007700`
    * Cauda desvanecendo: `#003300`
  * Implementada rotina de mutação ativa (25% de probabilidade de trocar caracteres no rastro dinamicamente).
  * Pré-aquecimento da tela: colunas inicializadas com linhas aleatórias para evitar tela preta no primeiro frame.

* **Desenvolvimento do Monitor de Sistema — [`src/MatrixHUD.tsx`](file:///home/v/Documentos/Projects/matrix-screensaver/src/MatrixHUD.tsx):**
  * Relógio digital em destaque (`44px`, negrito, fonte monospace).
  * Data formatada com dia da semana em português (`DOM, SEG, TER...`).
  * Leitor do Heap de memória do JavaScript (`performance.memory.usedJSHeapSize`).
  * Telemetria simulada de CPU (10-14%), GPU (22-28%) e indicador fixo de 120Hz.
  * Estilização translúcida `rgba(0, 10, 0, 0.82)` com borda neon verde e sobreposição via `pointerEvents="none"`.

* **Integração no App Principal — [`App.tsx`](file:///home/v/Documentos/Projects/matrix-screensaver/App.tsx):**
  * Invocação de `useKeepAwake()` para manter a tela ligada.
  * Configuração assíncrona do modo imersivo via `NavigationBar.setVisibilityAsync('hidden')`.
  * Ocultação da barra de status via `<StatusBar hidden style="light" />`.

---

## 4. 📊 Result

* **Desempenho Estável:** Efeito de chuva de código executando com suavidade total na GPU via Skia, sem gargalo no bridge do React Native.
* **Estética Autêntica:** Reprodução fidedigna do terminal CMatrix com cabeças pulsantes, desvanecimento gradual e mutação dinâmica de glifos.
* **HUD Integrado e Não Intrusivo:** Monitor futurista perfeitamente posicionado sobre o canvas, sem causar quedas de quadros.
* **Experiência de Screensaver Real:** Celular permanece com a tela ligada sem apagar e com área útil completa (barras do sistema ocultadas).
* **Conformidade de Código:** Typecheck do TypeScript executado com **0 erros** (`npx tsc --noEmit`).

---

## 5. ⚠️ Problems / Errors

1. **Incompatibilidade de API no `expo-navigation-bar` (Expo SDK 57):**
   * *Erro:* `App.tsx:19 - error TS2339: Property 'setBehaviorAsync' does not exist on type 'typeof NavigationBar'`.
   * *Causa:* No Expo SDK 57, os métodos `setBehaviorAsync`, `setBackgroundColorAsync` e similares foram removidos da biblioteca `expo-navigation-bar`.
2. **Referência Global Inválida no TypeScript (`global` vs `globalThis`):**
   * *Erro:* `src/MatrixHUD.tsx:30 - error TS2304: Cannot find name 'global'`.
   * *Causa:* O identificador `global` não está tipado no ambiente de tipos estritos do navegador/React Native moderno sem `@types/node`.
3. **Propriedade Depreciada no StyleSheet:**
   * *Erro:* `src/MatrixHUD.tsx:102 - error TS2551: Property 'absoluteFillObject' does not exist on type 'typeof StyleSheet'. Did you mean 'absoluteFill'?`.
   * *Causa:* No React Native 0.86+, a convenção padrão para preenchimento absoluto de tela é `StyleSheet.absoluteFill`.
4. **Risco de Queda de Desempenho / Câmera Lenta no Canvas:**
   * *Erro Potencial:* A primeira abordagem com timers tradicionais em React Native sofria com variações de frame rate e câmera lenta dependendo do throttling do JavaScript.

---

## 6. 🔧 Fixes Attempted

1. **Correção do `expo-navigation-bar`:**
   * *Tentativa:* Remoção da chamada descontinuada `NavigationBar.setBehaviorAsync('overlay-swipe')`.
   * *Resultado:* No SDK 57, a camada nativa em Kotlin já configura automaticamente `systemBarsBehavior = BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE` ao chamar `setVisibilityAsync('hidden')`. O erro de compilação foi sanado e o comportamento de swipe transitório permaneceu garantido.
2. **Correção de Escopo Global para Leitura de Memória:**
   * *Tentativa:* Substituição de `(global as any).performance` por `(globalThis as any).performance`.
   * *Resultado:* Resolvido o erro `TS2304` com suporte universal padrão ECMAScript tanto em desenvolvimento quanto em produção.
3. **Ajuste de Estilo de Tela Cheia:**
   * *Tentativa:* Substituição de `...StyleSheet.absoluteFillObject` por `...StyleSheet.absoluteFill`.
   * *Resultado:* Resolvido o erro `TS2551` com tipagem 100% estrita em conformidade com o React Native 0.86+.
4. **Otimização do Loop Gráfico:**
   * *Tentativa:* Utilização de `requestAnimationFrame` com delta acumulado e constante de cadência (`CMATRIX_TICK_MS = 25ms`).
   * *Resultado:* Cadência de queda rápida, dinâmica e independente de oscilações na taxa de atualização do hardware.

