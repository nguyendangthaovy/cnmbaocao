import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Avatar } from "react-native-elements";
import { useAppSelector, useAppDispatch } from "../store";
import {
  getProfile,
  meSelector,
  updateAvatar,
} from "../store/reducers/meSlice";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import meApi from "../service/meService";
import { setLogin } from "../store/reducers/authSlice";
import Modal from "react-native-modal";
import { getAcronym } from "../utils/functionGlobal";


export default function AddFriendScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { userProfile } = useAppSelector(meSelector);
  const [checked, setChecked] = React.useState(
    userProfile.gender ? "first" : "second"
  );
  const [dateOfBirth, setDateOfBirth] = useState(new Date(1598051730000));
  const [dobTitle, setDobTitle] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [image, setImage] = useState<string>(
    userProfile.avatar ? userProfile.avatar : ""
  );
  const nameRef: any = useRef();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDobTitle(handleDateOfBirth(date));
    setDateOfBirth(date);
    hideDatePicker();
  };

  const handleDateOfBirth = (dateOfBirth: Date) => {
    const date = dateOfBirth.getDate();
    const month = dateOfBirth.getMonth() + 1;
    const year = dateOfBirth.getFullYear();

    return (
      ("00" + date).slice(-2) + "/" + ("00" + month).slice(-2) + "/" + year
    );
  };

  useEffect(() => {
    const date = userProfile?.birthDay;
    const dob = new Date(date?.year, date?.month - 1, date?.day);
    setDobTitle(handleDateOfBirth(dob));
    setDateOfBirth(dob);
  }, []);

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const pickImage = async () => {
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    setModalVisible(!isModalVisible);

    if (!result.cancelled) {
      setImage(result.uri);
      upAvatar(result);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    setModalVisible(!isModalVisible);

    if (!result.cancelled) {
      setImage(result.uri);
      upAvatar(result);
    }
  };

  const upAvatar = (image: any) => {
    const fileName = Date.now().toString();
    const formData = new FormData();
    // formData.append("file", {
    //   name: image.fileName ? image.fileName : `${fileName}.png`,
    //   type: image.type,
    //   uri: Platform.OS === "android" ? image.uri.replace("file://", "") : image.uri,
    // });
    dispatch(updateAvatar(formData));
  };

  const onPress = () => {
    const dateOfBirthObj = {
      day: dateOfBirth.getDate(),
      month: dateOfBirth.getMonth() + 1,
      year: dateOfBirth.getFullYear(),
    };

    try {
      if (name.length >= 2) {
        meApi
          .updateProfile({
            name: name,
            gender: checked === "first" ? 1 : 0,
            dateOfBirth: dateOfBirthObj,
          })
          .then((res) => dispatch(getProfile()));
        navigation.goBack();
      } else {
        Alert.alert("Tên phải dài hơn 2 ký tự");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal isVisible={isModalVisible} style={{ alignItems: "center" }}>
        <View style={styles.containerModal}>
          <Pressable
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              padding: 5,
            }}
            onPress={toggleModal}
          >
            <AntDesign name="close" size={24} color="black" />
          </Pressable>
          {/* <Button title="Hide modal" onPress={toggleModal} /> */}
          <View style={{}}>
            <Button title="Chọn ảnh từ camera" onPress={takePhoto} />
            <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={dateOfBirth}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        onHide={() => false}
      />

      <View style={styles.container}>
        <View style={styles.Avatar}>
          <Pressable onPress={toggleModal}>
            <Avatar
              rounded
              title={getAcronym(userProfile.name)}
              overlayContainerStyle={{
                backgroundColor: userProfile.avatarColor,
              }}
              source={
                image
                  ? {
                      uri: image,
                    }
                  : {}
              }
              size={75}
            />
          </Pressable>
        </View>
        <View style={{}}>
          <View style={styles.UserName}>
            <TextInput
              ref={nameRef}
              style={styles.UserName}
              value={name}
              placeholderTextColor="#717070"
              onChangeText={(value) => {
                setName(value);
              }}
            />
          </View>
          <View style={styles.UserName}>
            <Text style={{ fontSize: 22 }}>{dobTitle}</Text>
          </View>
          <View style={styles.Radio}>
            <RadioButton.Android
              value="first"
              status={checked === "first" ? "checked" : "unchecked"}
              onPress={() => setChecked("first")}
              color="#33CCFF"
            />
            <Text style={{ fontWeight: "600", padding: 10 }}>
              Nam
            </Text>
            <RadioButton.Android
              value="second"
              status={checked === "second" ? "checked" : "unchecked"}
              onPress={() => setChecked("second")}
              color="#00CCFF"
            />
            <Text style={{  fontWeight: "600", padding: 10 }}>
              Nữ
            </Text>
          </View>
        </View>
        <View>
          <Pressable
            onPress={() => {
              nameRef.current.focus();
            }}
            style={styles.icon}
          >
            <AntDesign name="edit" size={30} color="gray" />
          </Pressable>
          <Pressable style={styles.icon} onPress={showDatePicker}>
            <AntDesign name="edit" size={30} color="gray" />
          </Pressable>
        </View>
      </View>
      <View style={{ alignItems: "center", backgroundColor: "white" }}>
        <TouchableOpacity
          style={[styles.btnEdit, { opacity: 1 }]}
          onPress={onPress}
        >
          <Text style={styles.textEdit}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
  },
  containerModal: {
    height: 150,
    width: "80%",
    backgroundColor: "white",
  },
  Avatar: {
    paddingTop: 10,
    paddingLeft: 10,
    flexDirection: "row",
    width: 100,
  },
  UserName: {
    flexDirection: "row",
    width: 250,
    paddingTop: 25,
    // paddingBottom: 15,
    borderBottomWidth: 0.7,
    borderColor: "#B5B5B5",
    fontSize: 22,
    borderBottomEndRadius: 1,
  },
  textUser: {
    fontWeight: "600",
   
    paddingLeft: 10,
  },
  icon: {
    paddingTop: 30,
    width: 50,
    paddingLeft: 10,
  },
  iconEdit: {
    flexDirection: "row",
  },
  Radio: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 15,
  },
  btnEdit: {
    width: 400,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#99CCFF",

    fontWeight: "600",
   
  },
  textEdit: {
    fontWeight: "500",
 
  },
});
