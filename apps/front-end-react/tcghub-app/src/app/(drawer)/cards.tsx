import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useTheme, Searchbar } from 'react-native-paper';
import Header from '@/components/header';
import { Image } from 'expo-image';

export default function Cards() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <View style={{ flex: 1, justifyContent: "flex-start", alignContent: "center", backgroundColor: theme.colors.background }}>
	  <Header text="Cards" />
	  <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
	  <ScrollView>
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
		<CardContainer />
	  </ScrollView>
    </View>
  );
}

function CardContainer() {
  return (
	<View style={{ flex: 1, alignContent: "center", width: "100%", height: "100%", }}>
	  <Image source={{ uri: "https://cards.scryfall.io/png/front/3/d/3d909852-d104-4f66-bfcb-fb0bf59dde67.png",
		headers: { 'User-Agent': 'TCGHUB/0.1', 'Accept': 'image/png' }}} style={styles.card}/>
	</View>
  )
};

const styles = StyleSheet.create({
  card: {
	width: 300,
	height: 418,
  }
});
