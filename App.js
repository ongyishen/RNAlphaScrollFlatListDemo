import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, ActivityIndicator } from "react-native";
import AlphaScrollFlatList from "alpha-scroll-flat-list";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ListItem, Avatar } from "react-native-elements";

const WIDTH = Dimensions.get("window").width;
const ITEM_HEIGHT = 80;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [seed, setSeed] = useState(1);
  const [error, setError] = useState(null);

  const makeRemoteRequest = () => {
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=200`;

    setError(null);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        const tmpData = [];
        for (const item in res.results) {
          tmpData.push({
            email: res.results[item].email,
            nameKey: res.results[item].name.first,
            picture: res.results[item].picture,
            name: res.results[item].name,
          });
        }
        setData(
          tmpData.sort((prev, next) => prev.nameKey.localeCompare(next.nameKey))
        );

        setError(res.error || null);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <ListItem bottomDivider>
          <Avatar source={{ uri: item.picture.thumbnail }} />
          <ListItem.Content>
            <ListItem.Title>{`${item.name.first} ${item.name.last}`}</ListItem.Title>
            <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  const keyExtractor = (item) => {
    return item.email;
  };

  useEffect(() => {
    makeRemoteRequest();
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View>
            <ActivityIndicator size="large" color="#00ff00"></ActivityIndicator>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={styles.screen}>
          <AlphaScrollFlatList
            keyExtractor={keyExtractor}
            data={data}
            renderItem={renderItem}
            scrollKey={"nameKey"}
            reverse={false}
            itemHeight={ITEM_HEIGHT}
            scrollBarColor={"#DB041B"}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width: WIDTH,
    flex: 1,
    flexDirection: "column",
    height: ITEM_HEIGHT,
  },
});
