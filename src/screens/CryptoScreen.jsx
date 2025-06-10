import { StyleSheet, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, Card, Avatar } from 'react-native-paper';

export default function CryptoScreen() {
  const [moedas, setMoedas] = useState([]);

  const buscarMoedas = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,dogecoin,cardano,polkadot,litecoin,shiba-inu,avalanche-2,tron&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      );
      const data = await response.json();
      const moedasFormatadas = data.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        current_price: item.current_price,
        price_change_percentage_24h: item.price_change_percentage_24h,
      }));
      setMoedas(moedasFormatadas);
    } catch (error) {
      console.log('Erro ao buscar moedas:', error);
    }
  };

  useEffect(() => {
    buscarMoedas();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={moedas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.name}
              left={() => <Avatar.Image size={40} source={{ uri: item.image }} />}
              titleStyle={styles.cardTitle}
            />
            <Card.Content>
              <Text style={styles.text}>Preço: ${item.current_price.toFixed(2)}</Text>
              <Text
                style={[
                  styles.text,
                  item.price_change_percentage_24h >= 0 ? styles.positivo : styles.negativo,
                ]}
              >
                Variação 24h: {item.price_change_percentage_24h.toFixed(2)}%
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1D22',
    padding: 16,
  },
  card: {
    backgroundColor: '#2C303A',
    marginBottom: 12,
    borderRadius: 12,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
  },
  text: {
    color: '#EAEAEA',
    fontSize: 16,
    marginBottom: 4,
  },
  positivo: {
    color: '#84DCC6',
  },
  negativo: {
    color: '#FF5E5E',
  },
});
