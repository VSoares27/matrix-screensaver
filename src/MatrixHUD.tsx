import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export function MatrixHUD() {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [ramUsage, setRamUsage] = useState<string>('28.4 MB');
  const [cpuUsage, setCpuUsage] = useState<number>(11);
  const [gpuUsage, setGpuUsage] = useState<number>(24);

  useEffect(() => {
    const updateHUD = () => {
      const now = new Date();

      // Horário
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}:${seconds}`);

      // Data
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
      setDateStr(`${weekdays[now.getDay()]}, ${day}/${month}/${year}`);

      // RAM
      try {
        const perf = (globalThis as any).performance;
        if (perf?.memory?.usedJSHeapSize) {
          const mb = (perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1);
          setRamUsage(`${mb} MB`);
        }
      } catch {
        // Silencioso
      }

      // Telemetria leve
      setCpuUsage(Math.floor(Math.random() * 4 + 10)); // 10-14%
      setGpuUsage(Math.floor(Math.random() * 6 + 22)); // 22-28%
    };

    updateHUD();
    // 🔥 Atualiza estritamente uma vez por segundo sem disputar frames de VSync com o Skia
    const timer = setInterval(updateHUD, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.hudOverlay} pointerEvents="none">
      <View style={styles.hudCard}>
        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTag}>[ SYSTEM MONITOR ]</Text>
          <View style={styles.statusDot} />
          <Text style={styles.headerStatus}>LIVE // 120Hz</Text>
        </View>

        {/* Relógio Digital */}
        <Text style={styles.clockText}>{timeStr}</Text>
        <Text style={styles.dateText}>{dateStr}</Text>

        {/* Linha Divisória */}
        <View style={styles.divider} />

        {/* Grid de Hardware: CPU | GPU | RAM | VSYNC */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>CPU</Text>
            <Text style={styles.statValue}>{cpuUsage}%</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>GPU</Text>
            <Text style={styles.statValue}>{gpuUsage}%</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>RAM</Text>
            <Text style={styles.statValue}>{ramUsage}</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DISPLAY</Text>
            <Text style={[styles.statValue, { color: '#00FF00' }]}>120Hz</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hudOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // 🔥 Removidos shadowRadius e elevation que forçavam blur pesado na GPU do Android
  hudCard: {
    backgroundColor: 'rgba(0, 10, 0, 0.82)',
    borderColor: '#00FF00',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    minWidth: 310,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTag: {
    color: '#00CC00',
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' }),
    fontWeight: 'bold',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00FF00',
    marginHorizontal: 8,
  },
  headerStatus: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' }),
  },
  clockText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 4,
    fontFamily: Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' }),
  },
  dateText: {
    color: '#00CC00',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 2,
    fontFamily: Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' }),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 255, 0, 0.35)',
    width: '100%',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#008800',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: 'bold',
    fontFamily: Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' }),
  },
  statValue: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 3,
    fontFamily: Platform.select({ android: 'monospace', ios: 'Courier', default: 'monospace' }),
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(0, 255, 0, 0.25)',
  },
});

