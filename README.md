# Snake Game en Motoko

Este proyecto implementa el clásico juego de Snake y permite guardar tus puntuaciones altas con autenticación de **Internet Identity** utilizando **Motoko**.

## Características

- **Autenticación**: Cada usuario se autentica mediante Internet Identity y se asigna un nombre único que no se puede cambiar una vez configurado.
- **Guardado de Puntuaciones**: Los puntajes se guardan automáticamente al finalizar el juego, y se muestra una lista con los 10 puntajes más altos.
- **Interfaz**: La interfaz del juego se desarrolló con **Bootstrap** para un diseño limpio y sencillo, mostrando los puntajes a la derecha del área de juego.

## Instalación y Configuración

Aquí tienes los comandos para descargar las dependencias necesarias:

1. **Instalar DFX SDK** (de Dfinity):

   Sigue los pasos en la [documentación de Dfinity](https://internetcomputer.org/docs/current/developer-docs/build/install/) para instalar `dfx`. 

2. **Clona el repositorio** en tu máquina local:
   ```bash
   git clone https://github.com/Rafae1TCC/snake_game_motoko.git
   cd snake_game_motoko
   ```

2. **Instalar Node.js y npm** (si aún no están instalados). Este paso depende de tu sistema operativo, pero aquí hay un ejemplo para sistemas basados en Ubuntu:

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

3. **Instalar las dependencias del frontend**

   Desde el directorio principal **(snake_game_motoko)**, ejecuta estos comandos para instalar las dependencias del proyecto que manejan el inicio de sesion con internet identity.
   ```bash
   cd src/snake_game_frontend
   npm install @dfinity/auth-client
   ```

4. **Desplegar los Canisters en el entorno local**

    Utiliza DFX para iniciar el entorno local desde la ruta principal **(snake_game_motoko)** y desplegar los canisters de Internet Identity y del backend del juego. Ejecuta los siguientes comandos:

    ```bash
    dfx start --background
    dfx deploy
    ```

5. **Ejecutar el proyecto**

    Una vez desplegados los canisters, puedes abrir tu navegador y visitar el link del canister snake_game_frontend para ver el juego de Snake en funcionamiento.

## Uso del Juego

1. **Iniciar sesión con Internet Identity**

Al abrir el juego, verás un botón para iniciar sesión con **Internet Identity** y un cuadro negro. Puedes empezar a jugar sin iniciar sesion con internet identity presionando "AWSD" o las flechas de direccion pero tus highscores no seran guardados. Para poder guardar tus highscores, presiona el boton para iniciar sesion con internet identity. Una vez autenticado, tus puntuaciones altas comenzaran a guardarse del lado derecho.

2. **Guardar puntuaciones y ver puntajes altos**

Al perder en el juego, tu puntuación se guarda automáticamente y se actualiza la lista de puntajes más altos a la derecha de la pantalla. La lista mostrará los 10 puntajes más altos de todos los jugadores.

## Contribuir

Si deseas contribuir al proyecto, puedes realizar un **fork** del repositorio, crear una rama para tus cambios y enviar una **pull request**. Asegúrate de documentar tus cambios y probar tu código antes de enviarlo.

## Licencia

Este proyecto está bajo la Licencia MIT.


