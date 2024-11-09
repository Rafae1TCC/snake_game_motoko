import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Order "mo:base/Order";  // Importar Order para poder usarlo en la función de comparación

actor SnakeGameBackend {

    type ScoreRecord = {
        userId: Principal;
        score: Nat;
    };

    stable var highScores: [ScoreRecord] = [];

    // Guardar puntuación y actualizar el listado si es un high score
    public func saveScore(userId: Principal, score: Nat): async Bool {
        // Verificar si la puntuación califica entre los top 10
        if (Array.size<ScoreRecord>(highScores) < 10 or Array.find<ScoreRecord>(highScores, func (record: ScoreRecord): Bool { score > record.score }) != null) {
            // Crear el nuevo record
            let newScoreRecord: ScoreRecord = { userId = userId; score = score };

            // Añadir el nuevo record al arreglo y ordenar
            highScores := Array.sort<ScoreRecord>(Array.append<ScoreRecord>([newScoreRecord], highScores), func (a: ScoreRecord, b: ScoreRecord): Order.Order { 
                if (a.score > b.score) {
                    #greater
                } else if (a.score < b.score) {
                    #less
                } else {
                    #equal
                }
            });

            // Mantener solo los 10 más altos
            highScores := Iter.toArray<ScoreRecord>(Array.slice<ScoreRecord>(highScores, 0, 10));

            return true;
        };
        return false;
    };

    // Función para obtener los high scores
    public query func getHighScores(): async [ScoreRecord] {
        return highScores;
    };
}
