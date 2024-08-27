import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { combinedData } from "../../../../database/Cards/combinedData";
import { useNavigation } from "@react-navigation/native";
import { getFirestore } from "firebase/firestore";
import { app } from "../../../../database/firebase";
import { useState } from "react";
import SaveOptionsAlert from "./SaveOptions";

const Deck = ({
  data,
  setCardsAdded,
  contador,
  limitations,
  setContador,
  LongPress,
  setLider,
}) => {
  const [SaveAlert, setSaveAlert] = useState(false);
  const ToggleSaveAlert = () => {
    setSaveAlert(!SaveAlert);
  };

  const ClearDeck = () => {
    setCardsAdded([]);
    setContador(0);
    setLider("")
  };

  const navigation = useNavigation();
  const goToHome = () => {
    navigation.navigate("Home");
  };

  const renderStackedCards = (cardObj) => {
    return (
      <TouchableOpacity
        key={cardObj.id}
        style={styles.cardContainer}
        onPress={() => LongPress(cardObj.id)}
        delayLongPress={400}
      >
        {cardObj.cards.map((card, index) => (
          <Image
            key={`${cardObj.id}-${index}`}
            source={{ uri: card.imgURL }}
            style={[styles.card, { top: -index * 2, left: index * 2 }]}
          />
        ))}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tablero}>
      <View style={styles.cards__container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            width: "100%",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
          }}
        >
          {data.map((cardObj) => {
            const cardCount = cardObj.cards.length;
            if (cardCount <= 6) {
              return renderStackedCards(cardObj);
            } else {
              return (
                <TouchableOpacity
                  key={cardObj.id}
                  style={styles.cardContainer}
                  onLongPress={() => LongPress(cardObj.id)}
                  delayLongPress={1000}
                >
                  <ImageBackground
                    source={{ uri: cardObj.cards[0].imgURL }}
                    style={styles.card}
                  >
                    <Text style={styles.cardCount}> {cardCount} </Text>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }
          })}
        </ScrollView>
      </View>
      <View style={styles.info__container}>
        <View style={{height: "100%", gap: 5}}>
          <TouchableOpacity
            onPress={ClearDeck}
            style={{
              width: 50,
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor: "black",
              borderBottomWidth: 0.8,
            }}
          >
            <Text style={{ fontWeight: "500" }}>Clear</Text>
            <EvilIcons name="trash" size={22} color="black" />
          </TouchableOpacity>
          <View style={{}}>
            <TouchableOpacity onPress={ToggleSaveAlert}>
              <Text
                style={{
                  fontWeight: "500",
                  borderBottomColor: "black",
                  borderBottomWidth: 0.8,
                }}
              >
                opciones de guardado
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 20}}>
          <Text>{limitations ? `${contador}/51` : contador}</Text>
        </View>
      </View>

      <SaveOptionsAlert
        onCancel={ToggleSaveAlert}
        onConfirm={""}
        visible={SaveAlert}
        AddedCards={data}
        togleAlert={ToggleSaveAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tablero: {
    height: 250,
    width: "98%",
    borderColor: "#262626",
    borderWidth: 2,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#d1d1d1",
    padding: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  cards__container: {
    width: "100%",
    flexDirection: "row",
    height: "80%",
    borderBottomColor: "#374378",
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  cardContainer: {
    position: "relative",
    width: 50,
    height: 70,
    marginRight: 5,
    marginTop: 9,
  },
  card: {
    position: "absolute",
    width: 50,
    height: 70,
    borderRadius: 5,
  },
  cardCount: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#000000",
    color: "white",
    borderRadius: 15,
    padding: 2,
    fontSize: 12,
    fontWeight: "700",
  },
  info__container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
});

export default Deck;
