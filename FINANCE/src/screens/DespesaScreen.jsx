import { StyleSheet, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, Card, FAB, Avatar, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DespesaScreen() {
  const [despesas, setDespesas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');

  const STORAGE_KEY = '@despesas';

  useEffect(() => {
    carregarDespesas();
  }, []);

  useEffect(() => {
    salvarDespesas();
  }, [despesas]);

  const carregarDespesas = async () => {
    try {
      const despesasSalvas = await AsyncStorage.getItem(STORAGE_KEY);
      if (despesasSalvas) {
        setDespesas(JSON.parse(despesasSalvas));
      }
    } catch (error) {
      console.log('Erro ao carregar despesas:', error);
    }
  };

  const salvarDespesas = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(despesas));
    } catch (error) {
      console.log('Erro ao salvar despesas:', error);
    }
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setDescricao('');
    setValor('');
    setData('');
  };

  const formatarValor = (text) => {
    let nova = text.replace(/[^0-9.,]/g, '');
    setValor(nova);
  };

  const adicionarDespesa = () => {
    if (!descricao || !valor || !data) {
      alert('Preencha todos os campos!');
      return;
    }

    const valorFloat = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorFloat)) {
      alert('Valor inválido');
      return;
    }

    const novaDespesa = {
      id: Date.now().toString(),
      descricao,
      valor: valorFloat,
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
                left={() => (
                  <Avatar.Icon
                    icon="arrow-down-bold-circle"
                    color="#FF5E5E"
                    style={{ backgroundColor: '#2C303A' }}
                  />
                )}
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
              onChangeText={formatarValor}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Ex: 100.50"
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
    backgroundColor: '#1B1D22',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#F2F2F2',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#2C303A',
  },
  valor: {
    fontSize: 20,
    color: '#FF5E5E',
    fontWeight: 'bold',
  },
  data: {
    color: '#EAEAEA',
    marginTop: 4,
  },
  semDados: {
    color: '#EAEAEA',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#415A77',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialog: {
    backgroundColor: '#2C303A',
  },
  input: {
    backgroundColor: '#415A77',
    marginBottom: 8,
  },
});

