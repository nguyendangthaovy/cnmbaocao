import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  badgeContainer: {
    backgroundColor: "#db342e",
    width: 25,
    height: 20,
    borderRadius: 10,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 2,
    maxWidth: 270,
  },
  text: {
    color: "grey",
    maxWidth: 280,
  },
  textBold: {
    fontWeight: "bold",
  },
  content: { flexDirection: "row", justifyContent: "space-between" },
  deleteGroup: {
    backgroundColor: "red",
    width: 70,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
