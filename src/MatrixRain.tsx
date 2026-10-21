import React, { useEffect, useRef } from 'react';
import { useWindowDimensions, StyleSheet, Platform } from 'react-native';
import { Canvas, Text, matchFont } from '@shopify/react-native-skia';

// Caracteres autênticos com suporte garantido em qualquer fonte monospace do Android
const MATRIX_CHARS =
  '0123456789' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '@#$%&*+-/<>[]{}|=;:~!?^';

const CHARS_LEN = MATRIX_CHARS.length;
const FONT_SIZE = 16;       // Tamanho ideal para leitura nítida e proporção correta
const CMATRIX_TICK_MS = 25; // 🔥 Fim da câmera lenta: cadência rápida e dinâmica

// Paleta verde clássico do CMatrix
const COLOR_HEAD = '#FFFFFF';   // Ponta branca brilhante
const COLOR_BRIGHT = '#00FF00'; // Verde fluorescente primário
const COLOR_MID = '#00CC00';    // Verde intermediário
const COLOR_DIM = '#007700';    // Verde escuro
const COLOR_FAINT = '#003300';  // Cauda desvanecendo

interface Column {
  x: number;
  row: number;
  length: number;
  stepDelay: number;
  stepCounter: number;
  chars: string[];
}

export function MatrixRain() {
  const { width, height } = useWindowDimensions();
  const [, setTick] = React.useState(0);

  // Fonte nativa monospace do Android
  const fontFamily = Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' });
  const font = matchFont({
    fontFamily,
    fontSize: FONT_SIZE,
    fontWeight: 'bold',
  });

  const columnsCount = Math.floor(width / FONT_SIZE);
  const rowsCount = Math.ceil(height / FONT_SIZE);

  const columnsRef = useRef<Column[]>([]);

  // Inicializa a tela já preenchida
  useEffect(() => {
    columnsRef.current = Array.from({ length: columnsCount }, (_, i) => {
      const length = Math.floor(Math.random() * 10 + 12); // Rastro entre 12 e 22 caracteres
      return {
        x: i * FONT_SIZE,
        row: Math.floor(Math.random() * rowsCount),
        length,
        stepDelay: Math.floor(Math.random() * 2 + 1), // Variação dinâmica rápida
        stepCounter: 0,
        chars: Array.from({ length: 30 }, () =>
          MATRIX_CHARS.charAt(Math.floor(Math.random() * CHARS_LEN))
        ),
      };
    });
  }, [columnsCount, rowsCount]);

  // Loop de VSync nativo na GPU
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let accumulated = 0;

    const onVSync = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      accumulated += delta;

      if (accumulated >= CMATRIX_TICK_MS) {
        accumulated = 0;
        const cols = columnsRef.current;
        const len = cols.length;

        for (let i = 0; i < len; i++) {
          const col = cols[i];
          col.stepCounter++;

          if (col.stepCounter >= col.stepDelay) {
            col.stepCounter = 0;
            col.row++;

            // 1. Gera caractere novo na ponta a cada degrau
            const newChar = MATRIX_CHARS.charAt(Math.floor(Math.random() * CHARS_LEN));
            col.chars.unshift(newChar);
            if (col.chars.length > 30) col.chars.pop();

            // Reinicia a coluna quando a cauda passa do rodapé
            if (col.row - col.length > rowsCount) {
              col.row = 0;
              col.length = Math.floor(Math.random() * 10 + 12);
              col.stepDelay = Math.floor(Math.random() * 2 + 1);
            }
          }

          // 2. Efeito de mutação viva no rastro
          if (Math.random() < 0.25) {
            const randIdx = Math.floor(Math.random() * col.length);
            col.chars[randIdx] = MATRIX_CHARS.charAt(Math.floor(Math.random() * CHARS_LEN));
          }
        }

        setTick((t) => (t + 1) | 0);
      }

      animId = requestAnimationFrame(onVSync);
    };

    animId = requestAnimationFrame(onVSync);
    return () => cancelAnimationFrame(animId);
  }, [rowsCount]);

  return (
    <Canvas style={styles.canvas}>
      {columnsRef.current.map((col, colIdx) => {
        return col.chars.slice(0, col.length).map((char, charIdx) => {
          const currentRow = col.row - charIdx;
          // Alinhamento exato da baseline tipográfica no Canvas do Skia
          const charY = currentRow * FONT_SIZE + FONT_SIZE * 0.85;

          if (charY < -FONT_SIZE || charY > height + FONT_SIZE) return null;

          // Gradiente clássico do terminal
          let color = COLOR_FAINT;
          if (charIdx === 0) color = COLOR_HEAD;
          else if (charIdx < 3) color = COLOR_BRIGHT;
          else if (charIdx < 8) color = COLOR_MID;
          else if (charIdx < col.length - 3) color = COLOR_DIM;

          return (
            <Text
              key={`${colIdx}-${charIdx}`}
              x={col.x}
              y={charY}
              text={char}
              font={font}
              color={color}
            />
          );
        });
      })}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#000000',
  },
});