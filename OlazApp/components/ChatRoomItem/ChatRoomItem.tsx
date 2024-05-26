import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";

import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../store";
import { getMessages } from "../../store/reducers/messageSlice";
import { setCurrentConversation } from "../../store/reducers/conversationSlice";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import jwt from "../../utils/jwt";

export interface ParamsApi {
  page: number;
  size: number;
}

export default function ChatRoomItem({ chatRoom }: { chatRoom: any }) {
  const user = { _id: jwt.getUserId() };

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const paramsApi: ParamsApi = {
    page: 0,
    size: 20,
  };

  const onPress = (conversation: any) => {
    const conversationId: string = conversation._id;
    dispatch(setCurrentConversation(conversation));
    dispatch(getMessages({ conversationId, paramsApi }));
    navigation.navigate("ChatRoom");
  };

  return (
    <Pressable style={styles.container} onPress={() => onPress(chatRoom)}>
      <CustomAvatar props={chatRoom} />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {chatRoom.name}
          </Text>
          {chatRoom.numberUnread ? (
            <Text style={styles.textBold}>
              {chatRoom.lastMessage.createdAt}
            </Text>
          ) : (
            <Text style={styles.text}>{chatRoom.lastMessage.createdAt}</Text>
          )}
        </View>
        <View style={styles.content}>
          {chatRoom.numberUnread ? (
            <Text
              numberOfLines={1}
              style={[styles.textBold, { maxWidth: 280 }]}
            >
              {chatRoom.lastMessage.user.name +
                ": " +
                chatRoom.lastMessage.content}
            </Text>
          ) : (
            <Text numberOfLines={1} style={styles.text}>
              {chatRoom.lastMessage.user.name +
                " :" +
                chatRoom.lastMessage.content}
            </Text>
          )}
          {chatRoom.numberUnread ? (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{chatRoom.numberUnread}</Text>
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
    </Pressable>
  );
}
