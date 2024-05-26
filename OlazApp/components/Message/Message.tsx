import { StyleSheet, Text, View, Image } from "react-native";
import MessageDivider from "./MessageDivider";
import dateUtils from "../../utils/dateUtils";
import jwt from "../../utils/jwt";
import MessageImage from "./MessageImage";
import GroupImage from "./GroupImage";
import { Avatar } from "react-native-elements";
import { getAcronym } from "../../utils/functionGlobal";

const Message = (props: any) => {
  const userId = { _id: jwt.getUserId() };
  const { index, item, messages, avatarColor } = props;
  const nextMessage: any = messages?.[index + 1];
  const nextMessageTime: any = new Date(nextMessage?.createdAt);
  const messageTime: any = new Date(item?.createdAt);
  const messageTimeTemp: any = new Date(item?.createdAt);

  // console.log(item);

  const isSeparate =
    messageTimeTemp.setMinutes(messageTimeTemp.getMinutes() - 5) >
    nextMessageTime;

  const myId = userId._id;
  const isMe = item.user._id === myId;

  return (
    <View>
      {isSeparate && <MessageDivider dateString={messageTime} />}
      {item.type === "TEXT" ? (
        chatContent.messageText(item, isMe, avatarColor)
      ) : item.type === "IMAGE" || item.type === "VIDEO" ? (
        <MessageImage item={item} isMe={isMe} avatarColor={avatarColor} />
      ) : item.type === "GROUP_IMAGE" ? (
        <GroupImage item={item} isMe={isMe} avatarColor={avatarColor} />
      ) : item.type === "NOTIFY" ? (
        chatContent.messageNotify(item, isMe)
      ) : (
        <></>
      )}
    </View>
  );
};

const chatContent = {
  messageNotify: (item: any, isMe: boolean) => {
    const { type, content, user } = item;
    const contentWithSenderName = `${isMe ? "Bạn" : user.name} ${content}`;
    return (
      <View style={[styles.containerNotify]}>
        <View>
          <Text style={{ fontSize: 13, flexWrap: "wrap" }}>
            {contentWithSenderName}
          </Text>
        </View>
      </View>
    );
  },
  messageText: (item: any, isMe: boolean, avatarColor: string) => (
    <View style={{ flexDirection: "row", marginLeft: 10 }}>
      {isMe ? (
        <></>
      ) : (
        <Avatar
          rounded
          title={getAcronym(item.user.name)}
          overlayContainerStyle={{
            backgroundColor: avatarColor ? avatarColor : item.user.avatarColor,
          }}
          source={
            item.user.avatar.length !== 0
              ? {
                  uri: item.user.avatar,
                }
              : {}
          }
          size={24}
        />
      )}

      <View
        style={[
          styles.container,
          isMe ? styles.rightContainer : styles.leftContainer,
        ]}
      >
        <View>
          <Text style={{ color: "black" }}>{item.content}</Text>
          <Text style={{ color: "black", fontSize: 10, marginTop: 5 }}>
            {dateUtils.getTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    maxWidth: "82%",
    minWidth: "22%",
  },
  containerNotify: {
    backgroundColor: "#fcfdff",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  leftContainer: {
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: "rgba(208,242,254,255)",
    marginLeft: "auto",
    marginRight: 10,
  },
});

export default Message;
