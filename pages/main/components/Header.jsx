import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../../../database/firebase";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { GlobalContext } from "../../../GlobalContext";

const Header = () => {
  const { username } = useContext(GlobalContext);

  const navigation = useNavigation();
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Signed out!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 15, color: "#202646"}}>{username}</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <AntDesign name="logout" size={24} color="#202646" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "99%",
        justifyContent: "space-between",
        position: "absolute",
        top: 30,
        alignSelf: "center",
        borderBottomColor: "#374378",
        borderBottomWidth: 1,
        paddingBottom: 3,
        paddingHorizontal: 5,
        zIndex: 100
    }
})

export default Header;