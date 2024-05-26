import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {    
    margin: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: 300,
    height: 30,
    paddingStart: 10,
    paddingEnd: 10,
  },
  input:{
    width: 270
  },
  closeButtonParent: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5
  },
    closeButton: {
    height: 17,
    width: 17,
  },
});

export default styles;