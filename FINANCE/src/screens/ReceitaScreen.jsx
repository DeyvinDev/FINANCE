import { StyleSheet, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, Card, FAB, Avatar, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReceitaScreen() {
  const [receitas, setReceitas] = useState([]);
  const [visible, setVisible] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');

  const STORAGE_KEY = '@receitas';

  useEffect(() => {
    carregarReceitas();
  }, []);

  useEffect(() => {
    salvarReceitas();
  }, [receitas]);

  const carregarReceitas = async () => {
    try {
      const receitasSalvas = await AsyncStorage.getItem(STORAGE_KEY);
      if (receitasSalvas) {
        setReceitas(JSON.parse(receitasSalvas));
      }
    } catch (error) {
      console.log('Erro ao carregar receitas:', error);
    }
  };

  const salvarReceitas = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(receitas));
    } catch (error) {
      console.log('Erro ao salvar receitas:', error);
    }
  };

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setDescricao('');
    setValor('');
    setData('');
  };

  // Função simples para permitir só números, vírgulas e pontos no valor
  const formatarValor = (text) => {
    let nova = text.replace(/[^0-9.,]/g, '');
    setValor(nova);
  };

  const adicionarReceita = () => {
    if (!descricao || !valor || !data) {
      alert('Preencha todos os campos!');
      return;
    }

    const valorFloat = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorFloat)) {
      alert('Valor inválido');
      return;
    }

    const novaReceita = {
      id: Date.now().toString(),
      descricao,
      valor: valorFloat,
      data,
    };
    setReceitas([...receitas, novaReceita]);
    hideDialog();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receitas</Text>

      {receitas.length === 0 ? (
        <Text style={styles.semDados}>Nenhuma receita registrada.</Text>
      ) : (
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.descricao}
                left={() => (
                  <Avatar.Icon
                    icon="arrow-up-bold-circle"
                    color="#84DCC6"
                    style={{ backgroundColor: '#2C303A' }}
                  />
                )}
              />
              <Card.Content>
                <Text style={styles.valor}>+ R$ {item.valor.toFixed(2)}</Text>
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
          <Dialog.Title>Nova Receita</Dialog.Title>
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
            <Button onPress={adicionarReceita}>Adicionar</Button>
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
    color: '#84DCC6',
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
