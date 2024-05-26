import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useAppSelector } from "../store";
import { friendSeletor } from "../store/reducers/friendSlice";
import ItemInvite from "../components/ItemInvite/ItemInvite";

const ListInviteScreen = () => {
  const { friendInvites, isLoading } = useAppSelector(friendSeletor);

  // console.log(friendInvites);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={friendInvites}
          renderItem={({ item }) => <ItemInvite friendInvite={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default ListInviteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
  },
});
