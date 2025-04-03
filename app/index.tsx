import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

type Exercise = {
  id: string;
  name: string;
  duration: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  const addExercise = () => {
    if (name && duration) {
      setExercises([...exercises, { id: Date.now().toString(), name, duration }]);
      setName('');
      setDuration('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajoute un exercice</Text>
      <TextInput placeholder="Nom de l'exercice" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Durée (s)" value={duration} onChangeText={setDuration} keyboardType="numeric" style={styles.input} />
      <Button title="Ajouter" onPress={addExercise} />

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/timer?name=${encodeURIComponent(item.name)}&duration=${encodeURIComponent(item.duration)}`)}
            style={styles.item}
          >
            <Text>{item.name} - {item.duration}s</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginTop: 10,
  },
});