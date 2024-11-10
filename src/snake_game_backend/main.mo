import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Order "mo:base/Order";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

actor SnakeGameBackend {

    type ScoreRecord = {
        userId: Principal;
        score: Nat;
        username: Text;
    };

    stable var highScores: [ScoreRecord] = [];

    // Guardar puntuación y actualizar el listado si es un high score
    public func saveScore(userId: Principal, score: Nat, username: Text,): async Bool {
        Debug.print("Intentando guardar la puntuación: " # Nat.toText(score));
        Debug.print("Tamaño actual de highScores antes de añadir: " # Nat.toText(Array.size<ScoreRecord>(highScores)));

        // Verificar si la puntuación califica entre los top 10
        if (Array.size<ScoreRecord>(highScores) < 10 or Array.find<ScoreRecord>(highScores, func (record: ScoreRecord): Bool { score > record.score }) != null) {
            // Crear el nuevo record
            let newScoreRecord: ScoreRecord = { userId = userId; score = score; username = username };

            // Añadir el nuevo record al arreglo y verificar el tamaño antes de ordenar
            highScores := Array.append<ScoreRecord>([newScoreRecord], highScores);

            if (Array.size<ScoreRecord>(highScores) > 1) {
                highScores := Array.sort<ScoreRecord>(highScores, func (a: ScoreRecord, b: ScoreRecord): Order.Order { 
                    if (a.score < b.score) {
                        #greater
                    } else if (a.score > b.score) {
                        #less
                    } else {
                        #equal
                    }
                });
            };

            // Mantener solo los 10 más altos si el tamaño del arreglo es mayor a 10
            if (Array.size<ScoreRecord>(highScores) > 10) {
                highScores := Iter.toArray<ScoreRecord>(Array.slice<ScoreRecord>(highScores, 0, 10));
            };

            Debug.print("Tamaño de highScores después de ordenar y cortar: " # Nat.toText(Array.size<ScoreRecord>(highScores)));

            return true;
        };

        Debug.print("La puntuación no califica para el top 10.");
        return false;
    };

    // Función para obtener los high scores
    public query func getHighScores(): async [ScoreRecord] {
        return highScores;
    };
}
