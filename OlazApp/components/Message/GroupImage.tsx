import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import dateUtils from "../../utils/dateUtils";
import ImageView from "react-native-image-viewing";
import { Video } from "expo-av";
import { Avatar } from "react-native-elements";
import { getAcronym } from "../../utils/functionGlobal";

const win = Dimensions.get("window");
const ratio = win.width / 541;

const GroupImage = (props: any) => {
  const { item, isMe, avatarColor } = props;

  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");

  const handleViewingImage = (link: string) => {
    setVisible(true);
    setUrl(link);
  };

  const checkType = (content: string) => {
    const splitTempt = content.split(".");
    const fileExtension = splitTempt[splitTempt.length - 1];
    if (fileExtension === "mp4") return "VIDEO";
    return "IMAGE";
  };

  const listImage = item.type === "GROUP_IMAGE" && item.content?.split(";");
  listImage.splice(listImage.length - 1, 1);

  return (
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
          isMe ? styles.rightImageGroup : styles.leftImageGroup,
        ]}
      >
        <View style={[styles.groupImage]}>
          {listImage.map((link: string, index: number) => {
            return checkType(link) === "VIDEO" ? (
              <Video
                key={link}
                style={[styles.imageStyle, { width: "50%" }]}
                source={{ uri: link }}
                useNativeControls
                isLooping
                volume={1.0}
              />
            ) : (
              <TouchableOpacity
                key={link}
                onPress={() => {
                  handleViewingImage(link);
                }}
                style={{ width: "50%" }}
              >
                <Image
                  source={{ uri: link }}
                  style={[styles.imageStyle, { backgroundColor: "black" }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.textTime}>
          <Text style={{ color: "white", fontSize: 10 }}>
            {dateUtils.getTime(item.createdAt)}
          </Text>
        </View>
        <ImageView
          images={[{ uri: url }]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        />
      </View>
    </View>
  );
};

export default GroupImage;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    maxWidth: "82%",
  },
  groupImage: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageStyle: {
    height: 362 * ratio, //362 is actual height of image
  },
  leftImageGroup: {
    marginLeft: 10,
    marginRight: "auto",
  },
  rightImageGroup: {
    marginLeft: "auto",
    marginRight: 10,
  },
  textTime: {
    backgroundColor: "rgba(52, 52, 52, 0.3)",
    width: 50,
    borderRadius: 100,
    paddingVertical: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 5,
  },
});
