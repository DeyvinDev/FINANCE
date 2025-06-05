import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import { Text, Card, Title, Paragraph, Avatar } from 'react-native-paper';

export default function DashBoardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bem vindo de testee volta!</Text>

      {/* Bloco superior - Valor atual, Receita e Despesa */}
      <View style={styles.row}>
        <Card style={styles.cardSmall}>
          <Card.Title title="Valor Atual" left={() => <Avatar.Icon icon="wallet" />} />
          <Card.Content>
            <Title style={styles.value}>R$ 5.450,00</Title>
          </Card.Content>
        </Card>

        <View style={styles.column}>
          <Card style={styles.cardTiny}>
            <Card.Title title="Receita" left={() => <Avatar.Icon icon="arrow-up-bold-circle" />} />
            <Card.Content>
              <Title style={styles.positive}>+ R$ 3.5000000,00</Title>
            </Card.Content>
          </Card>

          <Card style={styles.cardTiny}>
            <Card.Title title="Despesa" left={() => <Avatar.Icon icon="arrow-down-bold-circle" />} />
            <Card.Content>
              <Title style={styles.negative}>- R$ 2.150000,00</Title>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Gráfico de entrada e saída */}
      <Card style={styles.cardGraph}>
        <Card.Title title="Gráfico de Entrada e Saída" left={() => <Avatar.Icon icon="chart-line" />} />
        <Card.Content>
          <Paragraph style={styles.graphText}>[Aqui vai o gráfico de linha de entradas e saídas]</Paragraph>
        </Card.Content>
      </Card>

      {/* Valor Investido */}
      <View style={styles.rowCenter}>
        <Card style={styles.cardSmall}>
          <Card.Title title="Valor Investido" left={() => <Avatar.Icon icon="piggy-bank" />} />
          <Card.Content>
            <Title style={styles.value}>R$ 1.200,00</Title>
          </Card.Content>
        </Card>
      </View>

      {/* Gráfico de acompanhamento de investimento */}
      <Card style={styles.cardGraph}>
        <Card.Title title="Gráfico de Investimento" left={() => <Avatar.Icon icon="finance" />} />
        <Card.Content>
          <Paragraph style={styles.graphText}>[Aqui vai o gráfico de linha acompanhando o investimento]</Paragraph>
        </Card.Content>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a', // Azul escuro
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    width: '58%',
    backgroundColor: '#1b263b', // Azul mais claro
    padding: 4,
    borderRadius: 12,
  },
  cardTiny: {
    width: 140,
    height: 100,
    backgroundColor: '#1b263b',
    marginBottom: 8,
    padding: 4,
    borderRadius: 12,
  },
  cardGraph: {
    backgroundColor: '#1b263b',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  value: {
    fontSize: 22,
    color: '#e0e1dd',
    fontWeight: 'bold',
  },
  positive: {
    fontSize: 20,
    color: '#00ff99',
    fontWeight: 'bold',
  },
  negative: {
    fontSize: 20,
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
  graphText: {
    color: '#e0e1dd',
    textAlign: 'center',
    marginTop: 20,
  },
});
