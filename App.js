import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import StackNavigator from './StackNavigator';
import { UserContext } from './UserContext';

export default function App() {
  return (
    <UserContext>
      <SafeAreaView style={{ flex: 1, }}>
        <StackNavigator />
      </SafeAreaView>
    </UserContext>
  );
}


