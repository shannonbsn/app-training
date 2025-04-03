import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

type TimerParams = {
    name?: string;
    duration?: string | string[];
};

export default function TimerScreen() {
    const { name, duration }: TimerParams = useLocalSearchParams();
    const router = useRouter();

    const durationValue = Array.isArray(duration) ? duration[0] : duration || "0";
    const [timeLeft, setTimeLeft] = useState<number>(parseInt(durationValue, 10));

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name || "Exercice"}</Text>
            <Text style={styles.timer}>{timeLeft}s</Text>
            {timeLeft === 0 && <Text style={styles.finished}>Terminé !</Text>}
            <Button title="Retour" onPress={() => router.back()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25292e',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
    },
    timer: {
        fontSize: 50,
        color: '#ff4444',
    },
    finished: {
        fontSize: 22,
        color: '#00ff00',
        marginTop: 20,
    },
});