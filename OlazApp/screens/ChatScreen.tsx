import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import ChatRoomItem from "../components/ChatRoomItem";
import { useAppDispatch, useAppSelector } from "../store";
import { conversationSelector } from "../store/reducers/conversationSlice";
import { getMessages, resetMessageSlice } from "../store/reducers/messageSlice";
import jwt from "../utils/jwt";

export default function TabTwoScreen() {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(resetMessageSlice(null));
  // });

  const { isLoading, conversations } = useAppSelector(conversationSelector);

  const user = { _id: jwt.getUserId() };

  return (
    <View style={styles.page}>
      <StatusBar backgroundColor="#3399FF" />
      {isLoading ? (
        <ActivityIndicator style={{ paddingTop: 20 }} />
      ) : (
        <FlatList
          data={conversations}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    flex: 1,
  },
});
