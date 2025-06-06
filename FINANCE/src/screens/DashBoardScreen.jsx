import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, Card, Title, Paragraph, Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';

export default function DashBoardScreen() {
  const [totalDespesa, setTotalDespesa] = useState(0);
  const [totalReceita, setTotalReceita] = useState(0);
  const [despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [moedas, setMoedas] = useState([]);

  useEffect(() => {
    carregarDados();
    buscarMoedas();
  }, []);

  const buscarMoedas = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd'
      );
      const data = await response.json();
      setMoedas(data.slice(0, 10)); // pega as 10 primeiras moedas
    } catch (error) {
      console.error('Erro ao buscar moedas:', error);
    }
  };

  const carregarDados = async () => {
    try {
      const despesasSalvas = await AsyncStorage.getItem('@despesas');
      if (despesasSalvas) {
        const despesasJson = JSON.parse(despesasSalvas);
        setDespesas(despesasJson);
        const total = despesasJson.reduce((acc, item) => acc + Number(item.valor), 0);
        setTotalDespesa(total);
      } else {
        setDespesas([]);
        setTotalDespesa(0);
      }

      const receitasSalvas = await AsyncStorage.getItem('@receitas');
      if (receitasSalvas) {
        const receitasJson = JSON.parse(receitasSalvas);
        setReceitas(receitasJson);
        const total = receitasJson.reduce((acc, item) => acc + Number(item.valor), 0);
        setTotalReceita(total);
      } else {
        setReceitas([]);
        setTotalReceita(0);
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  const saldoAtual = totalReceita - totalDespesa;

  const organizarDadosGrafico = () => {
    const datas = new Set([
      ...despesas.map(d => d.data),
      ...receitas.map(r => r.data),
    ]);
    const datasOrdenadas = Array.from(datas).sort((a, b) => {
      const [diaA, mesA, anoA] = a.split('/');
      const [diaB, mesB, anoB] = b.split('/');
      return new Date(`${anoA}-${mesA}-${diaA}`) - new Date(`${anoB}-${mesB}-${diaB}`);
    });

    const valoresReceita = datasOrdenadas.map(data =>
      receitas
        .filter(r => r.data === data)
        .reduce((acc, item) => acc + Number(item.valor), 0)
    );

    const valoresDespesa = datasOrdenadas.map(data =>
      despesas
        .filter(d => d.data === data)
        .reduce((acc, item) => acc + Number(item.valor), 0)
    );

    return { datasOrdenadas, valoresReceita, valoresDespesa };
  };

  const { datasOrdenadas, valoresReceita, valoresDespesa } = organizarDadosGrafico();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bem vindo de volta!</Text>

      <View style={styles.row}>
        <Card style={styles.cardSmall}>
          <Card.Title
            title="Valor Atual"
            titleNumberOfLines={2}
            titleStyle={styles.cardTitle}
            left={() => (
              <Avatar.Icon
                icon="wallet"
                color="#E09A78"
                style={styles.iconWallet}
              />
            )}
          />
          <Card.Content>
            <Title style={styles.value}>R$ {saldoAtual.toFixed(2)}</Title>
          </Card.Content>
        </Card>

        <View style={styles.column}>
          <Card style={styles.cardTiny}>
            <Card.Title
              title="Receita"
              titleNumberOfLines={2}
              titleStyle={styles.cardTitle}
              left={() => (
                <Avatar.Icon
                  icon="arrow-up-bold-circle"
                  color="#84DCC6"
                  style={styles.iconReceita}
                />
              )}
            />
            <Card.Content>
              <Title style={styles.positive}>+ R$ {totalReceita.toFixed(2)}</Title>
            </Card.Content>
          </Card>

          <Card style={styles.cardTiny}>
            <Card.Title
              title="Despesa"
              titleNumberOfLines={2}
              titleStyle={styles.cardTitle}
              left={() => (
                <Avatar.Icon
                  icon="arrow-down-bold-circle"
                  color="#FF5E5E"
                  style={styles.iconDespesa}
                />
              )}
            />
            <Card.Content>
              <Title style={styles.negative}>- R$ {totalDespesa.toFixed(2)}</Title>
            </Card.Content>
          </Card>
        </View>
      </View>

      <Card style={styles.cardGraph}>
        <Card.Title
          title="Gráfico de Entrada e Saída"
          titleNumberOfLines={2}
          titleStyle={styles.cardTitle}
          left={() => (
            <Avatar.Icon
              icon="chart-line"
              color="#F2B8A0"
              style={styles.iconGraph}
            />
          )}
        />
        <Card.Content>
          {datasOrdenadas.length > 0 ? (
            <LineChart
              data={{
                labels: datasOrdenadas,
                datasets: [
                  {
                    data: valoresReceita,
                    color: () => '#84DCC6',
                    strokeWidth: 2,
                    label: 'Receita',
                  },
                  {
                    data: valoresDespesa,
                    color: () => '#FF5E5E',
                    strokeWidth: 2,
                    label: 'Despesa',
                  },
                ],
                legend: ['Receita', 'Despesa'],
              }}
              width={Dimensions.get('window').width - 32}
              height={220}
              yAxisLabel="R$ "
              chartConfig={{
                backgroundGradientFrom: '#2C303A',
                backgroundGradientTo: '#1B1D22',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                decimalPlaces: 2,
                style: { borderRadius: 16 },
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
              bezier
            />
          ) : (
            <Paragraph style={styles.graphText}>
              Nenhum dado para exibir no gráfico.
            </Paragraph>
          )}
        </Card.Content>
      </Card>

      <View style={styles.rowCenter}>
        <Card style={styles.cardSmall}>
          <Card.Title
            title="Valor Investido"
            titleNumberOfLines={2}
            titleStyle={styles.cardTitle}
            left={() => (
              <Avatar.Icon
                icon="piggy-bank"
                color="#E09A78"
                style={styles.iconInvest}
              />
            )}
          />
          <Card.Content>
            <Title style={styles.value}>R$ 1.200,00</Title>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.cardGraph}>
        <Card.Title
          title="Criptomoedas"
          titleNumberOfLines={2}
          titleStyle={styles.cardTitle}
          left={() => (
            <Avatar.Icon
              icon="currency-usd"
              color="#F2B8A0"
              style={styles.iconGraph}
            />
          )}
        />
        <Card.Content>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {moedas.map((item) => (
              <Card key={item.id} style={styles.cardCrypto}>
                <Card.Content style={{ alignItems: 'center' }}>
                  <Avatar.Image
                    source={{ uri: item.image }}
                    size={50}
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <Text style={styles.cryptoName}>{item.name}</Text>
                  <Text style={styles.cryptoPrice}>
                    ${item.current_price.toFixed(2)}
                  </Text>
                  <Text
                    style={[
                      styles.cryptoChange,
                      {
                        color:
                          item.price_change_percentage_24h >= 0
                            ? '#4CAF50'
                            : '#F44336',
                      },
                    ]}
                  >
                    {item.price_change_percentage_24h.toFixed(2)}%
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1D22',
    padding: 10,
  },
  header: {
    fontSize: 42,
    color: '#EAEAEA',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  column: {
    justifyContent: 'space-between',
  },
  cardSmall: {
    width: '55%',
    backgroundColor: '#2C303A',
  },
  cardTiny: {
    width: 162,
    marginBottom: 10,
    backgroundColor: '#2C303A',
  },
  cardGraph: {
    backgroundColor: '#2C303A',
    marginBottom: 20,
  },
  cardCrypto: {
    backgroundColor: '#2C303A',
    marginRight: 12,
    width: 120,
    borderRadius: 10,
    paddingVertical: 10,
  },
  cardTitle: {
    color: '#EAEAEA',
    fontWeight: 'bold',
  },
  iconWallet: {
    backgroundColor: '#1B1D22',
  },
  iconReceita: {
    backgroundColor: '#1B1D22',
  },
  iconDespesa: {
    backgroundColor: '#1B1D22',
  },
  iconInvest: {
    backgroundColor: '#1B1D22',
  },
  iconGraph: {
    backgroundColor: '#1B1D22',
  },
  value: {
    fontSize: 30,
    color: '#E09A78',
    fontWeight: 'bold',
  },
  positive: {
    fontSize: 20,
    color: '#84DCC6',
    fontWeight: 'bold',
  },
  negative: {
    fontSize: 20,
    color: '#FF5E5E',
    fontWeight: 'bold',
  },
  graphText: {
    color: '#EAEAEA',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'none',
  },
  cryptoName: {
    color: '#EAEAEA',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  cryptoPrice: {
    color: '#84DCC6',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cryptoChange: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
