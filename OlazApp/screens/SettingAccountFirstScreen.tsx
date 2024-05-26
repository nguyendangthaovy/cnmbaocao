import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Button,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { AntDesign, Entypo, Fontisto } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAppDispatch, useAppSelector } from "../store";
import { meSelector, updateAvatar } from "../store/reducers/meSlice";
import meApi from "../service/meService";
import { setLogin } from "../store/reducers/authSlice";
import Modal from "react-native-modal";
import { getAcronym } from "../utils/functionGlobal";

const radioButtonsData: RadioButtonProps[] = [
  {
    id: "1", // acts as primary key, should be unique and non-empty string
    label: "",
    value: "true",
    selected: true,
  },
  {
    id: "2",
    label: "",
    value: "false",
  },
];

const SettingAccountFirstScreen = () => {
  const dispatch = useAppDispatch();

  const { userProfile, isLoading } = useAppSelector(meSelector);
  const [radioButtons, setRadioButtons] =
    useState<RadioButtonProps[]>(radioButtonsData);

  const [image, setImage] = useState<string>("");
  const [gender, setGender] = useState<any>(true);

  function onPressRadioButton(radioButtonsArray: RadioButtonProps[]) {
    radioButtonsArray.forEach((e) => {
      if (e.selected) {
        console.log(e.value);
        setGender(e.value);
      }
    });
  }

  const [dateOfBirth, setDateOfBirth] = useState(new Date(1598051730000));
  const [dobTitle, setDobTitle] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
    // dispatch(updateAvatar(formData));
    // formData.append("file", {
    //   name: image.fileName ? image.fileName : `${fileName}.png`,
    //   type: image.type,
    //   uri: Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri,
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
      meApi
        .updateProfile({
          name: userProfile.name,
          gender: gender === true ? 1 : 0,
          dateOfBirth: dateOfBirthObj,
        })
        .then((res) => dispatch(setLogin(true)));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
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

      <View style={[styles.layout]}>
        <Text style={{ padding: 10, fontWeight: "bold" }}>
          Chọn ảnh đại diện
        </Text>
        <Pressable style={styles.avatarContainer} onPress={toggleModal}>
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
            size="xlarge"
          />
          <Entypo
            name="camera"
            size={24}
            color="black"
            style={styles.cameraAvatar}
          />
        </Pressable>
      </View>
      <View style={styles.layout}>
        <Text style={{ padding: 10, fontWeight: "bold" }}>Chọn giới tính</Text>
        <View style={{ marginLeft: 100, marginRight: 100 }}>
          <View style={styles.iconSex}>
            <Fontisto name="male" size={64} color="black" />
            <Fontisto name="female" size={64} color="black" />
          </View>
          <View>
            <RadioGroup
              radioButtons={radioButtons}
              layout="row"
              containerStyle={{
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: 7,
                marginRight: 7,
              }}
              onPress={onPressRadioButton}
            />
          </View>
        </View>
      </View>
      <View style={styles.layout}>
        <Text
          style={{
            padding: 10,
            fontWeight: "bold",
          }}
        >
          Chọn ngày sinh
        </Text>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={dateOfBirth}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          onHide={() => false}
        />

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Pressable onPress={showDatePicker}>
              <Fontisto name="date" size={34} color="black" />
            </Pressable>
            <Text style={{ marginLeft: 20, fontSize: 24 }}>{dobTitle}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Pressable style={styles.btn} onPress={onPress}>
              <View style={[styles.btn, { flexDirection: "row" }]}>
                <Text style={{ fontSize: 14, color: "white" }}>Tiếp tục</Text>
                <AntDesign name="right" size={14} color="white" />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingAccountFirstScreen;

const styles = StyleSheet.create({
  containerModal: {
    height: 150,
    width: "80%",
    backgroundColor: "white",
  },

  container: {
    flex: 1,
  },
  layout: {
    height: "33.33333333%",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraAvatar: {
    position: "absolute",
    bottom: 10,
    right: 150,
  },
  iconSex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "red",
    width: 70,
    height: 42,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
});
