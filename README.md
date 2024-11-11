# Snake Game en Motoko

Este proyecto implementa el clásico juego de Snake utilizando el lenguaje de programación Motoko y se ejecuta en la plataforma de Internet Computer (IC) de Dfinity. El juego incluye autenticación con **Internet Identity**, lo que permite a cada usuario guardar su nombre y puntuación más alta. Al perder, el usuario puede ver los puntajes altos de otros jugadores en tiempo real.

## Características

- **Autenticación**: Cada usuario se autentica mediante Internet Identity, eligiendo un nombre único que no se puede cambiar una vez configurado.
- **Guardado de Puntuaciones**: Los puntajes se guardan automáticamente al finalizar el juego, y se muestra una lista con los 10 puntajes más altos.
- **Interfaz**: La interfaz del juego se desarrolló con **Bootstrap** para un diseño limpio y sencillo, mostrando los puntajes a la derecha del área de juego.

## Requisitos

Aquí tienes los comandos para descargar las dependencias necesarias:

1. **Instalar Node.js y npm** (si aún no están instalados). Este paso depende de tu sistema operativo, pero aquí hay un ejemplo para sistemas basados en Ubuntu:

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

2. **Instalar DFX SDK** (de Dfinity):

   Sigue los pasos en la [documentación de Dfinity](https://internetcomputer.org/docs/current/developer-docs/build/install/) para instalar `dfx`. Por ejemplo, en sistemas basados en Ubuntu:

   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

3. **Instalar las dependencias del frontend** en el directorio raíz del proyecto, utilizando `npm`:

   ```bash
   npm install
   ```

4. **Instalar dotenv** para gestionar las variables de entorno en Node.js:

   ```bash
   npm install dotenv
   ```

5. **Instalar @dfinity/auth-client** para manejar la autenticación de Internet Identity:

   ```bash
   npm install @dfinity/auth-client
   ```

Estos comandos deben ejecutarse en la raíz del proyecto. Una vez instaladas las dependencias, puedes iniciar el servidor local con los canisters desplegados y comenzar a trabajar con el proyecto.

## Instalación y Configuración

1. **Clonar el repositorio**

Clona este repositorio en tu máquina local utilizando el siguiente comando en la terminal:

2. **Instalar Dependencias**

En el directorio del proyecto, instala las dependencias del frontend:


4. **Desplegar los Canisters en el entorno local**

Utiliza DFX para iniciar el entorno local y desplegar los canisters de Internet Identity y del backend del juego. Ejecuta los siguientes comandos:

5. **Ejecutar el proyecto**

Una vez desplegados los canisters, puedes iniciar el proyecto localmente con el comando:

Abre tu navegador y visita el link del canister snake_game_frontend para ver el juego de Snake en funcionamiento.

## Uso del Juego

1. **Iniciar sesión con Internet Identity**

Al abrir el juego, verás un botón para iniciar sesión con **Internet Identity**. Presiónalo para autenticarte. Una vez autenticado, tus puntuaciones altas comenzaran a guardarse del lado derecho.

2. **Guardar puntuaciones y ver puntajes altos**

Al perder el juego, tu puntuación se guarda automáticamente y se actualiza la lista de puntajes más altos a la derecha de la pantalla. La lista mostrará los 10 puntajes más altos de todos los jugadores.

## Dependencias

- **DFX SDK**: Para desplegar y ejecutar el backend en Internet Computer.
- **@dfinity/auth-client**: Módulo para la autenticación con Internet Identity en el frontend.
- **dotenv**: Para manejar las variables de entorno en el archivo `.env`.
- **Bootstrap**: Biblioteca de HTML utilizada en la interfaz del juego.

## Contribuir

Si deseas contribuir al proyecto, puedes realizar un **fork** del repositorio, crear una rama para tus cambios y enviar una **pull request**. Asegúrate de documentar tus cambios y probar tu código antes de enviarlo.

## Licencia

Este proyecto está bajo la Licencia MIT.


