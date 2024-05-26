import { View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./styles";
interface SearchProps {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const SearchInput = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  // const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={search}
        placeholderTextColor="#717070"
        placeholder="Tìm kiếm"
        autoFocus={true}
        onChangeText={(value) => {
          setSearch(value);
        }}
      />
      {search && (
        <TouchableOpacity
          style={styles.closeButtonParent}
          onPress={() => setSearch("")}
        >
          <Image
            style={styles.closeButton}
            source={require("../../assets/images/btn_flyemoji_close.png")}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;
