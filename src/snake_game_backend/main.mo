import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Order "mo:base/Order";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";

actor SnakeGameBackend {

    type ScoreRecord = {
        userId: Principal;
        score: Nat;
        username: Text;
    };

    // Creamos un HashMap para almacenar nombres de usuario, donde la clave es Principal y el valor es Text
    var userNames = HashMap.HashMap<Principal, Text>(128, Principal.equal, Principal.hash);

    stable var highScores: [ScoreRecord] = [];

    // Guardar puntuación y actualizar el listado si es un high score
    public func saveScore(userId: Principal, score: Nat, username: Text): async Bool {

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

            return true;
        };

        return false;
    };

    // Función para obtener los high scores
    public query func getHighScores(): async [ScoreRecord] {
        return highScores;
    };

    // Función para obtener el nombre de usuario del principal, si no tiene uno, lo asigna
    public func getOrSetUsername(userId: Principal, username: Text): async Text {
        // Buscar si ya existe el nombre de usuario para este principal
        switch (userNames.get(userId)) {
            case (?existingUsername) {
                return existingUsername;
            };
            case (_) {
                // Si no existe, asignar el nuevo nombre de usuario
                userNames.put(userId, username);
                return username;
            };
        };
    }
}
