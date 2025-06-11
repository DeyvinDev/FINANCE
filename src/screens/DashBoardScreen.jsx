import { StyleSheet, View, ScrollView, Dimensions, RefreshControl } from 'react-native';
import React, { useState, useCallback } from 'react';
import { Text, Card, Title, Avatar, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';

export default function DashBoardScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [transacoes, setTransacoes] = useState([]);
  const [totalDespesa, setTotalDespesa] = useState(0);
  const [totalReceita, setTotalReceita] = useState(0);
  const [despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);

  const STORAGE_KEY = '@transacoes';

  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
      const listaTransacoes = dadosSalvos ? JSON.parse(dadosSalvos) : [];

      setTransacoes(listaTransacoes);

      const listaReceitas = listaTransacoes.filter(t => t.tipo === 'receita');
      const listaDespesas = listaTransacoes.filter(t => t.tipo === 'despesa');

      setReceitas(listaReceitas);
      setDespesas(listaDespesas);

      const totalR = listaReceitas.reduce((acc, item) => acc + Number(item.valor), 0);
      const totalD = listaDespesas.reduce((acc, item) => acc + Number(item.valor), 0);

      setTotalReceita(totalR);
      setTotalDespesa(totalD);
    } catch (error) {
      console.log('Erro ao carregar dados do AsyncStorage:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const saldoAtual = totalReceita - totalDespesa;

  const organizarDadosGrafico = () => {
    const formatarDataParaISO = (dataStr) => {
      const [dia, mes, ano] = dataStr.split('/');
      const diaPad = dia.padStart(2, '0');
      const mesPad = mes.padStart(2, '0');
      return `${ano}-${mesPad}-${diaPad}`;
    };

    const datas = new Set([
      ...despesas.map(d => d.data),
      ...receitas.map(r => r.data),
    ]);

    const datasOrdenadas = Array.from(datas).sort((a, b) => {
      return new Date(formatarDataParaISO(a)) - new Date(formatarDataParaISO(b));
    });

    const valoresReceita = datasOrdenadas.map(data =>
      receitas.filter(r => r.data === data).reduce((acc, item) => acc + Number(item.valor), 0)
    );

    const valoresDespesa = datasOrdenadas.map(data =>
      despesas.filter(d => d.data === data).reduce((acc, item) => acc + Number(item.valor), 0)
    );

    return { datasOrdenadas, valoresReceita, valoresDespesa };
  };

  const { datasOrdenadas, valoresReceita, valoresDespesa } = organizarDadosGrafico();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Bem vindo de volta!</Text>

      <View style={styles.row}>
        <Card style={styles.cardSmall}>
          <Card.Title
            title="Saldo Atual"
            titleStyle={styles.cardTitle}
            left={() => <Avatar.Icon icon="wallet" color="#E09A78" style={styles.iconWallet} />}
          />
          <Card.Content>
            <Title style={styles.value}>R$ {saldoAtual.toFixed(2)}</Title>
          </Card.Content>
        </Card>

        <View style={styles.column}>
          <Card style={styles.cardTiny}>
            <Card.Title
              title="Receita"
              titleStyle={styles.cardTitle}
              left={() => <Avatar.Icon icon="arrow-up-bold-circle" color="#84DCC6" style={styles.iconReceita} />}
            />
            <Card.Content>
              <Title style={styles.positive}>+ R$ {totalReceita.toFixed(2)}</Title>
            </Card.Content>
          </Card>

          <Card style={styles.cardTiny}>
            <Card.Title
              title="Despesa"
              titleStyle={styles.cardTitle}
              left={() => <Avatar.Icon icon="arrow-down-bold-circle" color="#FF5E5E" style={styles.iconDespesa} />}
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
          titleStyle={styles.cardTitle}
          left={() => <Avatar.Icon icon="chart-line" color="#F2B8A0" style={styles.iconGraph} />}
        />
        <Card.Content>
          {datasOrdenadas.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={{
                  labels: datasOrdenadas,
                  datasets: [
                    {
                      data: valoresReceita,
                      color: (opacity = 1) => `rgba(132, 220, 198, ${opacity})`,
                      strokeWidth: 2,
                    },
                    {
                      data: valoresDespesa,
                      color: (opacity = 1) => `rgba(255, 94, 94, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                  legend: ['Receita', 'Despesa'],
                }}
                width={Math.max(Dimensions.get('window').width, datasOrdenadas.length * 120)} 
                height={240}
                yAxisLabel="R$ "
                chartConfig={{
                  backgroundGradientFrom: '#2C303A',
                  backgroundGradientTo: '#1B1D22',
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: {
                    r: '3',
                    strokeWidth: '1',
                    stroke: '#fff',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </ScrollView>
          ) : (
            <Text style={{ color: '#EAEAEA', textAlign: 'center' }}>Nenhum dado para exibir no gráfico</Text>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
        style={styles.buttonLogout}
        contentStyle={{ paddingVertical: 8 }}
      >
        Sair
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1D22',
    padding: 16,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  column: {
    justifyContent: 'space-between',
  },
  cardSmall: {
    flex: 1,
    backgroundColor: '#2C303A',
    marginRight: 8,
    borderRadius: 12,
  },
  cardTiny: {
    backgroundColor: '#2C303A',
    marginBottom: 8,
    borderRadius: 12,
    width: 140,
  },
  cardGraph: {
    backgroundColor: '#2C303A',
    marginBottom: 16,
    borderRadius: 12,
    paddingBottom: 8,
  },
  cardTitle: {
    color: '#EAEAEA',
    fontSize: 16,
  },
  value: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  positive: {
    color: '#84DCC6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  negative: {
    color: '#FF5E5E',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconWallet: {
    backgroundColor: '#2C303A',
  },
  iconReceita: {
    backgroundColor: '#2C303A',
  },
  iconDespesa: {
    backgroundColor: '#2C303A',
  },
  iconGraph: {
    backgroundColor: '#2C303A',
  },
  buttonLogout: {
    marginTop: 16,
    backgroundColor: '#FF5E5E',
  },
});
