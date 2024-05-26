import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";

const QRScanerScreen = () => {
  const navigation = useNavigation();

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      let temp: any = status === "granted";
      setHasPermission(temp);
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
    setScanned(true);
    // navigation.navigate("ProfileUser");
    navigation.navigate("ProfileUser", { userId: data });
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headBtn}>
        <Pressable onPress={() => navigation.navigate("Root")}>
          <AntDesign name="closecircle" size={24} color="white" />
        </Pressable>
        <MaterialCommunityIcons name="flashlight" size={24} color="white" />
      </View>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      <BarcodeMask width={250} height={250} />

      {/* {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )} */}
    </View>
  );
};

export default QRScanerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headBtn: {
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
  },
});
