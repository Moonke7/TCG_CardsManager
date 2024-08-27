import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { app } from "../../../../database/firebase";
import { GlobalContext } from "../../../../GlobalContext";
import { useNavigation } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const SaveOptionsAlert = ({ visible, onCancel, AddedCards, togleAlert }) => {
  const { userId, deckId, deckName, AddFolderToSearchCards, setSearchedCards } =
    useContext(GlobalContext);
  const [SavingSnack, setSavingSnack] = useState(false);
  const toggleSaving = () => setSavingSnack(!SavingSnack);
  const dismissSaving = () => setSavingSnack(false);
  const [SavedSnack, setSavedSnack] = useState(false);
  const toggleSaved = () => setSavedSnack(!SavedSnack);

  const navigation = useNavigation();

  const goToFolders = () => {
    navigation.navigate("Inventory");
  };
  goToSearchCards = () => {
    navigation.navigate("SearchCards");
  };

  const db = getFirestore(app);

  const SaveAddedCards = async () => {
    try {
      toggleSaving();
      const CardsToSaveCollection = collection(
        db,
        `users/${userId}/decks/${deckId}/cards`
      );

      const snapshot = await getDocs(CardsToSaveCollection);
      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      console.log("La carpeta ha sido limpiada.");

      // Ahora agregar las nuevas cartas
      for (const group of AddedCards) {
        for (const card of group.cards) {
          await addDoc(CardsToSaveCollection, {
            name: card.name,
            id: card.id,
            RealId: card.RealId,
            power: card.power,
            category: card.category,
            type: card.type,
            cost: card.cost,
            attribute: card.atribbute, // Corregido
            effect: card.effect,
            img: card.imgURL,
          });
        }
      }
      // togleAlert();
      dismissSaving();
      toggleSaved();
      console.log("Todas las cartas han sido guardadas exitosamente.");
    } catch (error) {
      console.log("ERROR: " + error);
    }
  };

  const transferCardsToFolder = async () => {
    const db = getFirestore(app);
    const folderName = deckName;

    if (folderName !== "") {
      try {
        await SaveAddedCards();
        const userFoldersCollection = collection(db, `users/${userId}/folders`);

        // Comprobar si la carpeta ya existe
        const nameQuery = query(
          userFoldersCollection,
          where("name", "==", folderName)
        );
        const querySnapshotName = await getDocs(nameQuery);

        let folderId;

        if (!querySnapshotName.empty) {
          folderId = querySnapshotName.docs[0].id;
        } else {
          // Si la carpeta no existe, crearla
          const newFolderRef = doc(userFoldersCollection);
          await setDoc(newFolderRef, {
            name: folderName,
          });
          folderId = newFolderRef.id;
          console.log("Folder added successfully!");
        }

        // Mover cartas de las guardadas en el mazo a la carpeta
        const recentAddedCollection = collection(
          db,
          `users/${userId}/decks/${deckId}/cards`
        );
        const cardsCollection = collection(
          db,
          `users/${userId}/folders/${folderId}/cards`
        );

        const querySnapshot = await getDocs(recentAddedCollection);

        for (const cardDoc of querySnapshot.docs) {
          const cardData = cardDoc.data();
          const cardQuantity = cardData.cantidad || 1; // Valor por defecto de cantidad es 1

          // Verificar si la carta ya existe en la carpeta
          const cardQuery = query(
            cardsCollection,
            where("id", "==", cardData.id)
          );
          const cardQuerySnapshot = await getDocs(cardQuery);

          if (!cardQuerySnapshot.empty) {
            // Actualizar cantidad si la carta ya existe
            const existingCardDoc = cardQuerySnapshot.docs[0];
            const existingCardData = existingCardDoc.data();
            const newCantidad = existingCardData.cantidad + cardQuantity;
            await updateDoc(existingCardDoc.ref, { cantidad: newCantidad });
            console.log(`Card ${cardData.name} quantity updated successfully!`);
          } else {
            // Añadir la carta si no existe
            const newCardRef = doc(cardsCollection);
            await setDoc(newCardRef, {
              ...cardData,
              cantidad: cardQuantity, // Añadir cantidad por defecto de 1
            });
            console.log(`Card ${cardData.name} added successfully!`);
          }

          // Eliminar la carta de la colección original
          await deleteDoc(cardDoc.ref);
        }
        const deleteDeckReference = doc(db, `users/${userId}/decks/${deckId}`);
        await deleteDoc(deleteDeckReference);
        goToFolders();
        console.log(
          "All cards transferred and recentAdded emptied successfully!"
        );
      } catch (error) {
        console.error("Error transferring cards: ", error);
      }
    } else {
      console.error("Folder name is empty!");
    }
  };

  const LookInInventory = async () => {
    if (AddedCards) {
      try {
        await SaveAddedCards();
        const userFoldersCollection = collection(db, `users/${userId}/folders`);
        const FoldersQuerySnapshot = await getDocs(userFoldersCollection);

        // Utilizar Promise.all para manejar las operaciones asíncronas dentro del forEach
        await Promise.all(
          FoldersQuerySnapshot.docs.map(async (folder) => {
            const folderData = folder.data();
            const folderName = folderData.name;
            const FolderId = folder.id;

            // Referencia a la colección de cartas de cada carpeta
            const CardsFromFolderCollection = collection(
              db,
              `users/${userId}/folders/${FolderId}/cards`
            );
            const CardsFromFolderQuery = await getDocs(
              CardsFromFolderCollection
            );

            let foundCardCount = 0;
            const CardsFound = [];

            CardsFromFolderQuery.forEach((card) => {
              const cardData = card.data();
              const id = cardData.RealId;

              const SearchedCard = AddedCards.find((c) => c.id === id);

              if (SearchedCard) {
                foundCardCount += 1;
                CardsFound.push(cardData);
              }
            });

            console.log(
              `Carpeta "${FolderId}" contiene ${foundCardCount} cartas buscadas.`
            );

            if (foundCardCount > 0) {
              const FolderObject = {
                name: folderName,
                id: FolderId,
                cantidad: foundCardCount,
                cards: CardsFound,
              };

              AddFolderToSearchCards(FolderObject);
              setSearchedCards(AddedCards);
              togleAlert();
            }
          })
        );

        goToSearchCards();
      } catch (error) {
        console.error("Error buscando en el inventario:", error);
      }
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.options__container}>
            <TouchableOpacity
              onPress={SaveAddedCards}
              style={styles.saveButton}
            >
              <Text>Guardar y salir</Text>
              <AntDesign name="save" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={transferCardsToFolder}
              style={styles.saveButton}
            >
              <Text>Añadir mazo como nuevo almacen</Text>
              <MaterialIcons name="data-saver-on" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={LookInInventory}
              style={styles.saveButton}
            >
              <Text>Buscar cartas en tu inventario</Text>
              <MaterialIcons name="manage-search" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.buttonText}>cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Snackbar
          visible={SavingSnack}
          style={{ width: "90%", alignSelf: "center" }}
          onDismiss={dismissSaving}
          action={{
            label: "close",
            onPress: () => {
              dismissSaving();
            },
          }}
        >
          Guardando cartas...
        </Snackbar>
        <Snackbar
          style={{ width: "90%", alignSelf: "center" }}
          visible={SavedSnack}
          onDismiss={toggleSaved}
          action={{
            label: "close",
            onPress: () => {
              toggleSaved();
            },
          }}
        >
          Todas las cartas han sido guardadas exitosamente.
        </Snackbar>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    padding: 7,
    backgroundColor: "#3d3d3d",
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  options__container: {
    gap: 15,
    marginBottom: 15,
  },
  saveButton: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});

export default SaveOptionsAlert;
