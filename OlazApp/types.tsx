/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface LoginParamList extends LoginStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Search: undefined;
  ChatRoom: undefined;
  AddFriendScreen: undefined;
  AddGroupScreen: undefined;
  MenuPopup: undefined;
  QRScreen: undefined;
  RequestAddFriend: undefined;
  EditUser: undefined;
  ProfileUser: { userId: string };
  EditProFileScreen: undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;

export type LoginStackParamList = {
  Security: undefined;
  LoginScreen: undefined | { username: string };
  RegisterScreen: undefined;
  ConfirmAccount: undefined | { user: any };
  SettingAccountFirst: undefined;
};

export type LoginRouteProps<RouteName extends keyof LoginStackParamList> =
  RouteProp<LoginStackParamList, RouteName>;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type LoginStackScreenProps<Screen extends keyof LoginStackParamList> =
  NativeStackScreenProps<LoginStackParamList, Screen>;

export type RootTabParamList = {
  TabChat: undefined;
  TabContact: undefined;
  TabUser: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;
