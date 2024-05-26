import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import JWTManager from "../utils/jwt";
import { disconnect } from "../utils/socketClient";
import { useAppDispatch, useAppSelector } from "../store";
import { resetAuthSlice } from "../store/reducers/authSlice";
import { useAuthContext } from "../contexts/AuthContext";
import { resetConversationSlice } from "../store/reducers/conversationSlice";
import { resetMessageSlice } from "../store/reducers/messageSlice";
import { Avatar } from "react-native-elements";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { userSelector } from "../store/reducers/userSlice";
import { meSelector } from "../store/reducers/meSlice";

export default function () {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { userProfile } = useAppSelector(meSelector);

  const { logoutClient } = useAuthContext();

  const logout = () => {
    if (dispatch) {
      dispatch(resetAuthSlice(null));
      dispatch(resetConversationSlice(null));
      dispatch(resetMessageSlice(null));
    }
    disconnect();
  };

  const onPress = async () => {
    logoutClient();
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <View style={styles.header}>
          {userProfile.avatar.length ? (
            <Avatar
              rounded
              overlayContainerStyle={{
                backgroundColor: userProfile.avatarColor,
              }}
              source={{
                uri: userProfile.avatar,
              }}
              size="medium"
            />
          ) : (
            <Avatar
              rounded
              title={userProfile.name[0]}
              overlayContainerStyle={{
                backgroundColor: userProfile.avatarColor,
              }}
              size="medium"
            />
          )}
          <Text style={styles.textNameUser}>{userProfile.name}</Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.Wallet}
            onPress={() => navigation.navigate("EditUser")}
          >
            <AntDesign name="edit" size={24} color="#1E90FF" />
            <Text style={styles.textWallet}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.Cloud}>
            <AntDesign name="cloudo" size={35} color="#1E90FF" />
            <Text style={styles.textCloud}>Cloud của tôi</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ alignItems: "flex-end", marginEnd: 20 }}>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.btnLogout, { opacity: 0.7 }]}
        >
          <View>
            <Pressable onPress={onPress}>
              <Text style={{ color: "white" }}>Đăng Xuất</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  containerTop: {
    // height: "80%",
  },
  header: {
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },
  btnLogout: {
    width: 150,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
    // backgroundColor: "#CDC9C9",
    backgroundColor: "#ee4d2d",
    // margin: 300,
  },
  Cloud: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  textCloud: {
    fontWeight: "500",
    fontSize: 17,
    paddingLeft: 10,
  },
  textNameUser: {
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 10,
  },
  Wallet: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
    borderBottomWidth: 0.7,
    borderColor: "#B5B5B5",
    borderBottomEndRadius: 1,
  },
  textWallet: {
    fontWeight: "500",
    fontSize: 17,
    paddingLeft: 10,
  },
});
