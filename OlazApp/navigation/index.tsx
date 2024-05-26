import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import SplashScreen from "../screens/SplashScreen";

import LoginNavigation from "./LoginNavigation";
import RootNavigator from "./RootNavigator";

export function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export function LoginStackNavigation() {
  return (
    <NavigationContainer>
      <LoginNavigation />
    </NavigationContainer>
  );
}
