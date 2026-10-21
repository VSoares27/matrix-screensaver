import React, { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import * as NavigationBar from 'expo-navigation-bar';
import { MatrixRain } from './src/MatrixRain';
import { MatrixHUD } from './src/MatrixHUD';

export default function App() {
  // Mantém a tela acesa
  useKeepAwake();

  useEffect(() => {
    async function configureImmersiveMode() {
      // Verifica com segurança se o módulo nativo existe antes de executar a Promise
      if (Platform.OS === 'android' && NavigationBar?.setVisibilityAsync) {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
        } catch (error) {
          // Ignora silenciosamente caso o Expo Go limite o acesso à barra nativa
          console.log('Modo imersivo de barra não suportado neste ambiente.');
        }
      }
    }

    configureImmersiveMode();
  }, []);

  return (
    <View style={styles.container}>
      {/* Oculta o relógio e bateria no topo */}
      <StatusBar hidden style="light" />
      {/* Chuva de código na GPU */}
      <MatrixRain />
      {/* Relógio Digital e Monitor de RAM */}
      <MatrixHUD />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});