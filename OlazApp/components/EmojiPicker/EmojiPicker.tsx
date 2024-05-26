import { StyleSheet, Text, View } from "react-native";
import React, { useState, memo } from "react";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

const EmojiPicker = memo((props: any) => {
  const { setContent } = props;
  console.log("-1");
  return (
    <EmojiSelector
      category={Categories.emotion}
      onEmojiSelected={(emoji) =>
        setContent((currentContent: string) => currentContent + emoji)
      }
      columns={8}
    />
  );
});

export default EmojiPicker;

const styles = StyleSheet.create({});
