import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ItemMeInvite from "../components/ItemInvite/ItemMeInvite";
import { useAppSelector } from "../store";
import { friendSeletor } from "../store/reducers/friendSlice";

const ListMeInviteScreen = () => {
  const { friendMeInvites } = useAppSelector(friendSeletor);

  // console.log(friendMeInvites);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={friendMeInvites}
        renderItem={({ item }) => <ItemMeInvite friendMeInvite={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ListMeInviteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
  },
});
