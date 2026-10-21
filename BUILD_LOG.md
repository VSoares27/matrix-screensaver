# 🛠️ BUILD LOG — Matrix Screensaver

> **Data de Geração:** 21 de Outubro de 2026  
> **Versão da Base:** 1.0.0  
> **Stack:** Expo SDK 57 | React Native 0.86.3 | React 19.2.3 | TypeScript 6.0 | Shopify Skia 2.6.2  

---

## 1. 📋 Visão Geral do Projeto

O **Matrix Screensaver** é uma aplicação móvel imersiva projetada para funcionar como um protetor de tela e dock station cyberpunk de alta fidelidade. O objetivo principal do projeto foi recriar a clássica chuva de código digital inspirada no utilitário de terminal **CMatrix**, com suporte a **60-120 FPS cravados**, sem engasgos ou sobrecarga da CPU móvel, acompanhado de um painel de monitoramento de sistema (HUD) com telemetria em tempo real.

---

## 2. 🧱 Arquitetura e Componentes Desenvolvidos

### 2.1. Motor Gráfico — `src/MatrixRain.tsx`
O coração do protetor de tela. Substituiu a abordagem ingênua baseada em Views do React por renderização direta em **Canvas 2D via GPU** utilizando `@shopify/react-native-skia`.

* **Renderização Direta na GPU:** Elimina a criação de centenas de nós na árvore do Virtual DOM do React Native, desenhando os caracteres diretamente pelo Skia (`<Canvas />`, `<Text />`).
* **Loop VSync Dinâmico:** Implementado via `requestAnimationFrame` acoplado ao `performance.now()`, com controle delta de tempo e cadência de tick fixa (`CMATRIX_TICK_MS = 25ms`), eliminando o efeito de câmera lenta e garantindo suavidade.
* **Fidelidade CMatrix Clássica:**
  * **Cabeça luminosa:** Caractere da ponta desenhado em branco brilhante (`#FFFFFF`).
  * **Gradiente de decaimento:** 4 tonalidades de verde fluorescente a escuro (`#00FF00`, `#00CC00`, `#007700`, `#003300`).
  * **Mutações ativas:** 25% de chance por tick de alterar aleatoriamente os glifos que já estão caindo no rastro.
  * **Comprimentos e velocidades variáveis:** Trilhas de 12 a 22 caracteres, com cadência (`stepDelay`) independente por coluna.
  * **Pré-aquecimento de tela:** Todas as colunas são inicializadas com posições verticais aleatórias, preenchendo a tela instantaneamente ao abrir o app (sem tela preta inicial).
* **Alinhamento Tipográfico:** Ajuste preciso da baseline (`FONT_SIZE * 0.85`) e fonte nativa monospaçada (`monospace` no Android / `Courier` no iOS).

### 2.2. HUD Cyberpunk & Telemetria — `src/MatrixHUD.tsx`
Painel central flutuante que exibe relógio e telemetria de hardware no estilo terminal futurista.

* **Relógio & Data:** Horário digital 24h (`HH:mm:ss`) e calendário formatado com dia da semana (`DOM, SEG, TER...`).
* **Telemetria de Hardware:**
  * **RAM:** Monitoramento dinâmico da memória heap do JavaScript (`performance.memory.usedJSHeapSize`).
  * **CPU & GPU:** Indicadores simulados de carga de hardware com oscilação orgânica (10-14% CPU, 22-28% GPU).
  * **Display:** Indicação de taxa de atualização (120Hz).
* **Otimização de Desempenho:**
  * Ciclo de atualização isolado em 1 segundo (`setInterval(..., 1000)`), garantindo que as mudanças de estado do HUD não disputem frames com o loop de 120 FPS do Skia.
  * Uso de `pointerEvents="none"` para não interceptar eventos de toque.
  * Remoção de filtros de sombra pesados (`shadowRadius` / `elevation`) para manter o consumo de bateria e fill-rate baixos.

### 2.3. Orquestrador e Modo Imersivo — `App.tsx`
Configuração de nível de aplicativo para experiência autêntica de screensaver:

* **Prevenção de Suspensão de Tela:** Integração com `expo-keep-awake` (`useKeepAwake()`) para manter a tela continuamente ligada enquanto o app estiver aberto.
* **Modo Imersivo Android:** Ocultação da barra de navegação virtual (`NavigationBar.setVisibilityAsync('hidden')`) com suporte automático a barras transitórias por gesto (`BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE`).
* **Barra de Notificações Oculta:** `StatusBar hidden` configurado para remover relógio e ícones de bateria padrão do sistema operacional.

### 2.4. Compilador e Configuração — `babel.config.js` & `app.json`
* Criação de `babel.config.js` configurado com `babel-preset-expo` e o plugin `react-native-reanimated/plugin` para suporte a worklets e animações nativas.
* Configuração do plugin `expo-status-bar` no `app.json`.

---

## 3. 📦 Dependências Adicionadas

| Pacote | Versão | Propósito |
| :--- | :--- | :--- |
| `@shopify/react-native-skia` | `2.6.2` | Motor gráfico 2D de altíssima performance acelerado por GPU |
| `react-native-reanimated` | `4.5.1` | Suporte a worklets de animação nativa na UI thread |
| `expo-keep-awake` | `~57.0.2` | Trava o display contra desligamento/timeout automático |
| `expo-navigation-bar` | `~57.0.3` | Controle do modo imersivo da barra inferior do Android |
| `expo-status-bar` | `~57.0.1` | Ocultação da barra de notificações e relógio do SO |

---

## 4. 🗂️ Registro Detalhado de Arquivos Modificados / Criados

| Arquivo | Estado | Descrição das Modificações |
| :--- | :---: | :--- |
| [`src/MatrixRain.tsx`](file:///home/v/Documentos/Projects/matrix-screensaver/src/MatrixRain.tsx) | **Criado** | Motor de partículas e chuva digital Matrix no Skia Canvas |
| [`src/MatrixHUD.tsx`](file:///home/v/Documentos/Projects/matrix-screensaver/src/MatrixHUD.tsx) | **Criado** | Componente do HUD central com relógio e estatísticas de memória |
| [`App.tsx`](file:///home/v/Documentos/Projects/matrix-screensaver/App.tsx) | **Modificado** | Integração dos componentes, keep-awake e modo imersivo do Android |
| [`babel.config.js`](file:///home/v/Documentos/Projects/matrix-screensaver/babel.config.js) | **Criado** | Configuração do preset Expo e plugin do Reanimated |
| [`app.json`](file:///home/v/Documentos/Projects/matrix-screensaver/app.json) | **Modificado** | Registro do plugin `expo-status-bar` |
| [`package.json`](file:///home/v/Documentos/Projects/matrix-screensaver/package.json) | **Modificado** | Inclusão das dependências Skia, Reanimated e módulos Expo |
| [`BUILD_LOG.md`](file:///home/v/Documentos/Projects/matrix-screensaver/BUILD_LOG.md) | **Criado** | Documentação completa do build, arquitetura e decisões de projeto |

---

## 5. ⚡ Verificações de Qualidade e Compilação

* **TypeScript Typecheck:** `npx tsc --noEmit` executado com **sucesso (0 erros)**.
* **Compatibilidade Expo SDK 57:**
  * Atualização da chamada do `expo-navigation-bar` para a API moderna do SDK 57 (remoção do método descontinuado `setBehaviorAsync`).
  * Utilização correta de `StyleSheet.absoluteFill` e `globalThis` para tipagem estrita no React Native 0.86+.

---

## 6. 🚀 Como Executar

```bash
# Iniciar o servidor de desenvolvimento do Expo
npx expo start

# Executar diretamente no dispositivo Android
npx expo start --android

# Validação de tipos TypeScript
npx tsc --noEmit
```

