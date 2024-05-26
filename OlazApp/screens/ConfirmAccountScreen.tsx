import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LoginRouteProps } from "../types";
import { Button } from "react-native-elements";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { setLoading } from "../store/reducers/authSlice";
import { useAppDispatch } from "../store";
import { StatusBar } from "expo-status-bar";
import { confirmAccount, login, resetOTP } from "../service/authService";
import jwt from "../utils/jwt";
import { configAxios } from "../utils/httpRequest";
import { getProfile } from "../store/reducers/meSlice";

const CELL_COUNT = 6;
const RESEND_OTP_TIME_LIMIT = 60;
const ConfirmAccountScreen = () => {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();

  const route = useRoute<LoginRouteProps<"ConfirmAccount">>();
  const account = route.params?.user;

  let resendOtpTimerInterval: any;

  const [errorMessage, setErrorMessage] = useState("");
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );

  const [otpValue, setOtpValue] = useState("");
  const ref = useBlurOnFulfill({ value: otpValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: (text) => setOtpValue(text),
  });

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const handleOnResendOtp = async () => {
    //clear input field
    setOtpValue("");
    setErrorMessage("");
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();
    dispatch(setLoading(true));
    const response = await resetOTP(account.username);
    dispatch(setLoading(false));
  };

  const handleConfirm = async () => {
    if (otpValue.length === 6) {
      dispatch(setLoading(true));
      try {
        const response = await handleConfirmAccount(account.username, otpValue);
        // dispatch()
        // console.log("res", response);
        await handleLogin();
      } catch (error) {
        console.log("ConfirmAccountScreen", error);
        dispatch(setLoading(false));
        setErrorMessage("OTP không đúng hoặc hết hạn");
      }
    } else {
      setErrorMessage("OTP không hợp lệ");
    }
  };

  const handleLogin = async () => {
    const result = await login(account.username, account.password);
    jwt.setToken(result?.data.token);
    configAxios();
    dispatch(getProfile()).then((e) =>
      navigation.navigate("SettingAccountFirst")
    );
  };

  const handleConfirmAccount = async (username: string, otp: string) => {
    const response = await confirmAccount({ username, otp });
    return response;
  };

  //start timer on screen on launch
  useEffect(() => {
    startResendOtpTimer();
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <StatusBar style="light" />
      {/* <Spinner
        visible={isLoading}
        textContent={"Loading..."}
        textStyle={globalStyles.spinnerTextStyle}
      /> */}

      <SafeAreaView style={{}}>
        {account?.password ? (
          <>
            <Text style={styles.title}>Nhập mã OTP</Text>
            <Text style={styles.subTitle}>
              Đã gửi mã OTP đến {account.username}
            </Text>
            <CodeField
              ref={ref}
              {...props}
              value={otpValue}
              onChangeText={setOtpValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <View
                  onLayout={getCellOnLayoutHandler(index)}
                  key={index}
                  style={[styles.cellRoot, isFocused && styles.focusCell]}
                >
                  <Text style={styles.cellText}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                </View>
              )}
            />

            <Text
              style={{
                ...styles.errorText,
                marginLeft: 24,
                marginTop: 20,
                marginBottom: -12,
              }}
            >
              {errorMessage}
            </Text>

            {/* View for resend otp  */}
            {resendButtonDisabledTime > 0 ? (
              <Text style={styles.resendCodeText}>
                Gửi lại mã OTP sau {resendButtonDisabledTime} giây
              </Text>
            ) : (
              <TouchableOpacity onPress={handleOnResendOtp}>
                <View style={styles.resendCodeContainer}>
                  <Text style={styles.resendCode}> Gửi lại mã OTP</Text>
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.button}>
              <Button
                title="Xác nhận"
                onPress={handleConfirm}
                buttonStyle={{
                  backgroundColor: "red",
                }}
              />
            </View>
          </>
        ) : (
          <></>
          // <View style={{ width: "100%" }}>
          //   <View style={{ alignItems: "center", paddingTop: 20 }}>
          //     <Avatar
          //       title={commonFuc.getAcronym(account?.name)}
          //       rounded
          //       size="large"
          //       overlayContainerStyle={{
          //         backgroundColor: OVERLAY_AVATAR_COLOR,
          //       }}
          //       source={account?.avatar && { uri: account?.avatar }}
          //     />
          //   </View>
          //   <Text
          //     style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
          //   >
          //     {account.name}
          //   </Text>
          //   <Text style={{ fontSize: 16, textAlign: "center" }}>
          //     {account.username}
          //   </Text>
          //   <Text style={styles.title}>
          //     {`${account.username.includes("@") ? "Email" : "Số điện thoại"} ${
          //       account.username
          //     } đã được sử dụng`}{" "}
          //   </Text>

          //   <Button
          //     title="Đăng nhập"
          //     buttonStyle={{ backgroundColor: MAIN_COLOR }}
          //     onPress={() => navigation.popToTop()}
          //   />
          //   <Button
          //     title="Dùng số điện thoại/email khác"
          //     type="outline"
          //     buttonStyle={{ borderColor: MAIN_COLOR }}
          //     titleStyle={{ color: MAIN_COLOR }}
          //     onPress={() => navigation.goBack()}
          //     containerStyle={{ marginTop: 15 }}
          //   />
          // </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmAccountScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#0068FF",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    textAlign: "left",
    fontSize: 20,
    marginStart: 20,
    marginVertical: 20,
    // fontWeight: 'bold',
  },
  subTitle: {
    textAlign: "left",
    fontSize: 16,
    marginStart: 20,
    marginTop: 10,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: "90%",
    marginLeft: 20,
    marginRight: 20,
  },
  cellRoot: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 28,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },

  button: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  resendCode: {
    color: "red",
    marginStart: 20,
    marginTop: 20,
  },
  resendCodeText: {
    marginStart: 20,
    marginTop: 20,
  },
  resendCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginTop: -10,
    marginLeft: 10,
    color: "red",
  },
});
