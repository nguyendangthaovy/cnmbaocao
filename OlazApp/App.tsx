
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import useCachedResources from "./hooks/useCachedResources";
import { LoginStackNavigation, Navigation } from "./navigation";

import SplashScreen from "./screens/SplashScreen";
import store, { useAppSelector } from "./store";
import { authSelector } from "./store/reducers/authSlice";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <AppScreen />
        </Provider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

const AppScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLogin } = useAppSelector(authSelector);

  const handleCheckLogin = async () => {

    setIsLoading(false);
  };

  useEffect(() => {
    handleCheckLogin();

    // console.log(a);
  }, []);

  return isLoading ? (
    <NavigationContainer>
      <SplashScreen />
    </NavigationContainer>
  ) : isLogin ? (
    <Navigation />
  ) : (
    <LoginStackNavigation />
  );
};
