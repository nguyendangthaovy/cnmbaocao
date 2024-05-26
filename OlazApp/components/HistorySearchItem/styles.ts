import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingLeft: 10,
    paddingRight: 10,
    maxWidth: 80,
    alignItems: "center",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  name: { fontSize: 14, marginBottom: 2, textAlign: "center" },
});

export default  styles;