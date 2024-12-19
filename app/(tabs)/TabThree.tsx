import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';

const TabThreeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to Tab Three!</Text>
  </View>
);

export default TabThreeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
