import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { useAppDispatch, useAppSelector } from "../store";
import {
  getMessages,
  messageSelector,
  rerenderMessage,
} from "../store/reducers/messageSlice";
import { conversationSelector } from "../store/reducers/conversationSlice";
import MessageDivider from "../components/Message/MessageDivider";
import { socket } from "../utils/socketClient";
import jwt from "../utils/jwt";

export default function ChatRoomScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const scrollViewRef: any = useRef();
  const user = { _id: jwt.getUserId() };

  const { conversation, conversationId } = useAppSelector(conversationSelector);
  const { messages, isLoading } = useAppSelector(messageSelector);

  const [apiParams, setApiParams] = useState({
    page: 0,
    size: 20,
  });

  useEffect(() => {
    if (conversation.name) {
      navigation.setOptions({ title: conversation.name });
    }
  }, [false]);

  const goToNextPage = async () => {
    const currentPage = apiParams.page;
    const totalPages = messages.totalPages;
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      const newParam = { ...apiParams, page: nextPage };

      await dispatch(getMessages({ conversationId, paramsApi: newParam }));

      setApiParams(newParam);
    }
  };

  return (
    <SafeAreaView style={styles.page}>
      {!messages.data ? (
        <ActivityIndicator
          style={{
            paddingTop: 20,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      ) : (
        <FlatList
          onEndReached={() => {
            goToNextPage();
          }}
          inverted
          data={[...messages.data].reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Message
              index={index}
              item={item}
              messages={[...messages.data].reverse()}
              avatarColor={conversation.avatarColor}
            />
          )}
          initialNumToRender={20}
          ListFooterComponent={() =>
            isLoading ? <MessageDivider isLoading={true} /> : null
          }
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 15 }}
        />
      )}
      <MessageInput
        conversationId={conversationId}
        scrollViewRef={scrollViewRef}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "rgba(226,233,241,255)",
    // backgroundColor: "#e1e4ea",
    paddingBottom: 10,
  },
});
