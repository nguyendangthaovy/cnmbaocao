import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import dateUtils from "../../utils/dateUtils";

const MessageDivider = (props: any) => {
  const { dateString, isLoading } = props;

  const time = dateUtils.getTime(dateString);
  const date = dateUtils.getDate(dateString);
  const dateTemp = new Date();
  const dateNow = dateUtils.getDate(dateTemp);

  dateTemp.setDate(dateTemp.getDate() - 1);

  const dataOld = dateUtils.getDate(dateTemp);

  return isLoading ? (
    <View style={styles.loading}>
      <ActivityIndicator size={12} color={"#0068FF"} />
      <Text style={styles.date}> Đang tải...</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.date}>{`${time}, ${
        date === dateNow ? "Hôm nay" : date === dataOld ? "Hôm qua" : date
      }`}</Text>
    </View>
  );
};

export default MessageDivider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(52, 52, 52, 0.3)",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loading: {
    backgroundColor: "rgba(52, 52, 52, 0.3)",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  date: {
    color: "#FFF",
    fontSize: 12,
    textAlignVertical: "center",
  },
});
