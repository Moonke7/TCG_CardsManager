import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  TouchableHighlight,
  ImageBackground,
  Alert,
  FlatList,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { combinedData } from "../../../../database/Cards/combinedData";
import { Multicolor } from "../../../../database/Cards/OpCards - multicolor";
import { app } from "../../../../database/firebase";
import { GlobalContext } from "../../../../GlobalContext";

const AllCards = ({ addCard, loading }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(Multicolor);
  const [Data, setData] = useState(combinedData);
  const [colors, setColors] = useState({
    red: false,
    blue: false,
    green: false,
    yellow: false,
    black: false,
    purple: false,
    multicolor: false,
  });

  useEffect(() => {
    setResults(Multicolor.filter((card) => card.id.includes(":01")));
  }, []);

  const filter = () => {
    let filteredResults = Data.filter((card) => card.id.includes(":01"));

    if (search !== "") {
      filteredResults = filteredResults.filter(
        (card) =>
          card.name.toLowerCase().includes(search.toLowerCase()) ||
          card.id.toString().includes(search)
      );
    }

    const activeColors = Object.keys(colors).filter((color) => colors[color]);
    if (activeColors.length > 0) {
      filteredResults = filteredResults.filter((card) =>
        activeColors.some((color) => card.color.toLowerCase().includes(color))
      );
    }

    if (filteredResults.length === 0) {
      Alert.alert("No hay resultados para esta búsqueda");
      setResults(Multicolor);
    } else {
      setResults(filteredResults);
    }
  };

  const ColorFilter = (color) => {
    setColors((prevColors) => {
      const newColors = { ...prevColors, [color]: !prevColors[color] };
      let filteredResults = Data.filter((card) => card.id.includes(":01"));

      if (search !== "") {
        filteredResults = filteredResults.filter(
          (card) =>
            card.name.toLowerCase().includes(search.toLowerCase()) ||
            card.id.toString().includes(search)
        );
      }

      const activeColors = Object.keys(newColors).filter(
        (clr) => newColors[clr]
      );
      if (activeColors.length > 0) {
        filteredResults = filteredResults.filter((card) =>
          activeColors.some((clr) => card.color.toLowerCase().includes(clr))
        );
      }

      setResults(filteredResults.length > 0 ? filteredResults : Multicolor);
      return newColors;
    });
  };

  const updateSearch = (e) => {
    setSearch(e);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top__info}>
        <View style={styles.filter__container}>
          <Text
            style={{
              fontWeight: "bold",
              margin: 3,
            }}
          >
            Filtros por color
          </Text>
          <View style={{ flexDirection: "row" }}>
            <BouncyCheckbox
              size={18}
              style={{ padding: 0, margin: 0 }}
              fillColor={"red"}
              unFillColor={"transparent"}
              isChecked={colors.red}
              onPress={() => ColorFilter("red")}
            />
            <BouncyCheckbox
              size={18}
              style={{ gap: 0 }}
              fillColor={"black"}
              unFillColor={"transparent"}
              isChecked={colors.black}
              onPress={() => ColorFilter("black")}
            />
            <BouncyCheckbox
              size={18}
              style={{ gap: 0 }}
              fillColor={"blue"}
              unFillColor={"transparent"}
              isChecked={colors.blue}
              onPress={() => ColorFilter("blue")}
            />
            <BouncyCheckbox
              size={18}
              style={{ gap: 0 }}
              fillColor={"green"}
              unFillColor={"transparent"}
              isChecked={colors.green}
              onPress={() => ColorFilter("green")}
            />
            <BouncyCheckbox
              size={18}
              style={{ gap: 0 }}
              fillColor={"#faff0d"}
              unFillColor={"transparent"}
              isChecked={colors.yellow}
              onPress={() => ColorFilter("yellow")}
            />
            <BouncyCheckbox
              size={18}
              style={{ gap: 0 }}
              fillColor={"purple"}
              unFillColor={"transparent"}
              isChecked={colors.purple}
              onPress={() => ColorFilter("purple")}
            />
            <BouncyCheckbox
              size={18}
              style={{ gap: 0 }}
              fillColor={"#5d5d5d"}
              unFillColor={"transparent"}
              isChecked={colors.multicolor}
              onPress={() => ColorFilter("multicolor")}
            />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={updateSearch}
            value={search}
            placeholder="Buscar por nombre / id "
            onSubmitEditing={filter}
          />
          <Feather
            name="search"
            size={24}
            color="black"
            style={styles.lupa}
            onPress={filter}
          />
          <View style={styles.note}>
            <Text style={{ fontWeight: "bold", color: "red" }}>Nota: </Text>
            <Text style={{ fontWeight: "600" }}>
              los diseños alternativos se pueden cambiar presionando las cartas
              agregadas
            </Text>
          </View>
        </View>
      </View>
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={5} // Number of columns for layout
          columnWrapperStyle={styles.columnWrapper} // Style for the row wrapper
          contentContainerStyle={styles.scrollContent}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => addCard(item.id)} disabled={loading}>
              <ImageBackground
                source={{ uri: item.imgURL }}
                style={styles.card}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Image
          style={{ width: 300, height: 300 }}
          source={{
            uri: "https://media.tenor.com/of43hCTlDrUAAAAj/one-piece-z-studios.gif",
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#292929",
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 10,
    width: "100%",
    marginVertical: 8,
    fontSize: 14,
    backgroundColor: "#e7e7e7",
    color: "#292929",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: 60,
    height: 90,
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingLeft: "2%",
    paddingBottom: 65,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    gap: 15,
    paddingHorizontal: "2%",
  },
  top__info: {
    height: 150,
    width: "98%",
    borderBottomColor: "#374378",
    borderBottomWidth: 0.5,
    paddingBottom: 3,
    paddingHorizontal: 5,
    marginVertical: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  buttons__container: {
    height: 50,
    justifyContent: "space-between",
  },
  lupa: {
    position: "absolute",
    right: 10,
    bottom: 14,
  },
  filter__container: {
    width: "60%",
    backgroundColor: "#ededed",
  },
  note: {
    flexDirection: "row",
    width: "160%",
    position: "absolute",
    top: -42,
  },
});

export default AllCards;
