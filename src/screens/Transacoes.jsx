import { StyleSheet, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Text, Card, FAB, Avatar, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';

export default function TransacoesScreen() {
  const [transacoes, setTransacoes] = useState([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [categoria, setCategoria] = useState('Outros');

  const STORAGE_KEY = '@transacoes';

  useEffect(() => {
    carregarTransacoes();
  }, []);

  const carregarTransacoes = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);
      const lista = dados ? JSON.parse(dados) : [];
      setTransacoes(lista);
    } catch (error) {
      console.log('Erro ao carregar transações:', error);
    }
  };

  const salvarTransacoes = async (novaLista) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
      setTransacoes(novaLista);
    } catch (error) {
      console.log('Erro ao salvar transações:', error);
    }
  };

  const adicionarTransacao = () => {
    if (!descricao || !valor || !data) {
      alert('Preencha todos os campos!');
      return;
    }

    const valorFloat = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorFloat)) {
      alert('Valor inválido!');
      return;
    }

    const novaTransacao = {
      id: Date.now().toString(),
      tipo,
      descricao,
      valor: valorFloat,
      data,
      categoria,
      dataRegistro: new Date().toISOString(),
    };

    const novaLista = [novaTransacao, ...transacoes];
    salvarTransacoes(novaLista);
    limparCampos();
    setVisibleDialog(false);
  };

  const limparCampos = () => {
    setDescricao('');
    setValor('');
    setData('');
    setTipo('despesa');
    setCategoria('Outros');
  };

  const removerTransacao = (id) => {
    const novaLista = transacoes.filter((t) => t.id !== id);
    salvarTransacoes(novaLista);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>

      <FlatList
        data={transacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={[styles.card, item.tipo === 'receita' ? styles.receitaCard : styles.despesaCard]}>
            <Card.Title
              title={item.descricao}
              subtitle={`Categoria: ${item.categoria}`}
              left={() => (
                <Avatar.Icon
                  icon={item.tipo === 'receita' ? 'arrow-up-bold-circle' : 'arrow-down-bold-circle'}
                  color={item.tipo === 'receita' ? '#84DCC6' : '#FF5E5E'}
                  style={{ backgroundColor: 'transparent' }}
                />
              )}
              right={() => (
                <Button onPress={() => removerTransacao(item.id)} compact color="#ccc">
                  Remover
                </Button>
              )}
            />
            <Card.Content>
              <Text style={styles.valor}>
                {item.tipo === 'receita' ? '+ R$' : '- R$'} {item.valor.toFixed(2)}
              </Text>
              <Text style={styles.data}>Data: {item.data}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.semDados}>Nenhuma transação registrada.</Text>}
      />

      <FAB icon="plus" style={styles.fab} onPress={() => setVisibleDialog(true)} />

      <Portal>
        <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)} style={styles.dialog}>
          <Dialog.Title>Nova Transação</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              style={styles.input}
              placeholder="Ex: Supermercado"
              placeholderTextColor="#ccc"
            />
            <TextInput
              label="Valor"
              value={valor}
              onChangeText={(text) => setValor(text.replace(/[^0-9.,]/g, ''))}
              keyboardType="numeric"
              style={styles.input}
              placeholder="Ex: 59,90"
              placeholderTextColor="#ccc"
            />
            <MaskedTextInput
              mask="99/99/9999"
              keyboardType="numeric"
              onChangeText={(text, rawText) => setData(text)}
              value={data}
              style={[styles.input, styles.maskedInput]}
              placeholder="Data (dd/mm/aaaa)"
              placeholderTextColor="#ccc"
            />
            <TextInput
              label="Categoria"
              value={categoria}
              onChangeText={setCategoria}
              style={styles.input}
              placeholder="Ex: Alimentação"
              placeholderTextColor="#ccc"
            />

            <Text style={styles.tipoLabel}>Tipo:</Text>
            <View style={styles.tipoContainer}>
              <Button
                mode={tipo === 'despesa' ? 'contained' : 'outlined'}
                onPress={() => setTipo('despesa')}
                style={styles.tipoBotao}
              >
                Despesa
              </Button>
              <Button
                mode={tipo === 'receita' ? 'contained' : 'outlined'}
                onPress={() => setTipo('receita')}
                style={styles.tipoBotao}
              >
                Receita
              </Button>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(false)}>Cancelar</Button>
            <Button onPress={adicionarTransacao}>Adicionar</Button>
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
    textAlign: 'center',
  },
  card: {
    marginBottom: 12,
  },
  despesaCard: {
    backgroundColor: '#2C303A',
  },
  receitaCard: {
    backgroundColor: '#24493D',
  },
  valor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EAEAEA',
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
    color: '#fff',
  },
  maskedInput: {
    padding: 12,
    borderRadius: 4,
  },
  tipoLabel: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F2F2F2',
  },
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tipoBotao: {
    flex: 1,
    marginRight: 8,
  },
});
