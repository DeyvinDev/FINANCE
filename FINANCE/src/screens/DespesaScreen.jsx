import { StyleSheet, View, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Text, Card, FAB, Avatar, Button, Dialog, Portal, TextInput } from 'react-native-paper';

export default function DespesaScreen() {
  const [despesas, setDespesas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setDescricao('');
    setValor('');
    setData('');
  };

  const adicionarDespesa = () => {
    const novaDespesa = {
      id: Math.random().toString(),
      descricao,
      valor: parseFloat(valor),
      data,
    };
    setDespesas([...despesas, novaDespesa]);
    hideDialog();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Despesas</Text>

      {despesas.length === 0 ? (
        <Text style={styles.semDados}>Nenhuma despesa registrada.</Text>
      ) : (
        <FlatList
          data={despesas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.descricao}
                left={() => <Avatar.Icon icon="arrow-down-bold-circle" />}
              />
              <Card.Content>
                <Text style={styles.valor}>- R$ {item.valor.toFixed(2)}</Text>
                <Text style={styles.data}>Data: {item.data}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={showDialog}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title>Nova Despesa</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
            />
            <TextInput
              label="Valor"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Data"
              value={data}
              onChangeText={setData}
              placeholder="dd/mm/aaaa"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={adicionarDespesa}>Adicionar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1b2a',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#1b263b',
  },
  valor: {
    fontSize: 20,
    color: '#ff4d4d',
    fontWeight: 'bold',
  },
  data: {
    color: '#e0e1dd',
    marginTop: 4,
  },
  semDados: {
    color: '#e0e1dd',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#415a77',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialog: {
    backgroundColor: '#1b263b',
  },
  input: {
    backgroundColor: '#415a77',
    marginBottom: 8,
  },
});
