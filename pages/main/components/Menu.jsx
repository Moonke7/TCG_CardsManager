import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

const Menu = () => {
  const navigation = useNavigation();

  const GoToInvetary = () => {
    navigation.navigate("Inventory");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigation.navigate("Home")}>
        <Text style={styles.text}>Crear mazo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={GoToInvetary}>
        <Text style={styles.text}>Inventario</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigation.navigate("Home")}>
        <Text style={styles.text}>Mazos guardados</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "start",
    justifyContent: "center",
    gap: 15,
  },
  text: {
    fontSize: 25,
    borderBottomColor: "#545454",
    borderBottomWidth: 1,
    color: "#545454",
  }
});

export default Menu;
