import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function TimerScreen() {
    const params = useLocalSearchParams();
    const name = typeof params.name === "string" ? params.name : "Exercice";
    const duration = typeof params.duration === "string" ? parseInt(params.duration, 10) : 0;
    const repetitions = typeof params.repetitions === "string" ? parseInt(params.repetitions, 10) : 1;
    const pause = typeof params.pause === "string" ? parseInt(params.pause, 10) : 0;

    const router = useRouter();

    const [timeLeft, setTimeLeft] = useState<number>(duration);
    const [currentRep, setCurrentRep] = useState<number>(1);
    const [isResting, setIsResting] = useState<boolean>(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            if (!isResting && currentRep < repetitions) {
                setIsResting(true);
                setTimeLeft(pause);
            } else if (isResting) {
                setIsResting(false);
                setTimeLeft(duration);
                setCurrentRep(currentRep + 1);
            }
        }
    }, [timeLeft, isResting, currentRep]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.repText}>Répétition {currentRep}/{repetitions}</Text>
            <Text style={styles.timer}>{timeLeft}s</Text>
            {isResting && <Text style={styles.restText}>Pause</Text>}
            {currentRep > repetitions && <Text style={styles.finished}>Terminé !</Text>}
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
    repText: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
    },
    timer: {
        fontSize: 50,
        color: '#ff4444',
    },
    restText: {
        fontSize: 22,
        color: '#ffaa00',
        marginTop: 20,
    },
    finished: {
        fontSize: 22,
        color: '#00ff00',
        marginTop: 20,
    },
});