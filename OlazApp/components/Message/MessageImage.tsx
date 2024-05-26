import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import dateUtils from "../../utils/dateUtils";
import { Video, Audio } from "expo-av";
import ImageView from "react-native-image-viewing";
import { BackgroundImage } from "react-native-elements/dist/config";
import { Avatar } from "react-native-elements";
import { getAcronym } from "../../utils/functionGlobal";

const win = Dimensions.get("window");
const ratio = win.width / 541;

const MessageImage = (props: any) => {
  const { item, isMe, avatarColor } = props;

  const checkType = (content: string) => {
    const splitTempt = content.split(".");
    const fileExtension = splitTempt[splitTempt.length - 1];
    if (fileExtension === "mp4") return "VIDEO";
    return "IMAGE";
  };

  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState("");

  const handleViewingImage = (link: string) => {
    setVisible(true);
    setUrl(link);
  };

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
        style={[styles.viewImage, isMe ? styles.rightImage : styles.leftImage]}
      >
        <View>
          {checkType(item.content) === "VIDEO" ? (
            <Video
              style={styles.imageStyle}
              source={{ uri: item.content }}
              useNativeControls
              isLooping
              volume={1.0}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                handleViewingImage(item.content);
              }}
              style={{ width: "50%" }}
            >
              <Image
                source={{ uri: item.content }}
                style={[styles.imageStyle, { backgroundColor: "black" }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
          <View style={styles.textTime}>
            <Text style={{ color: "white", fontSize: 10 }}>
              {dateUtils.getTime(item.createdAt)}
            </Text>
          </View>
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

export default MessageImage;

const styles = StyleSheet.create({
  imageStyle: {
    width: win.width - 100,
    height: 362 * ratio + 180, //362 is actual height of image
    borderRadius: 10,
  },
  viewImage: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    maxWidth: "82%",
  },
  leftImage: {
    marginLeft: 10,
    marginRight: "auto",
  },
  rightImage: {
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
