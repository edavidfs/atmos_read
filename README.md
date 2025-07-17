# Atmos Read

Este repositorio contiene un ejemplo sencillo de una interfaz en Python que actúa como una pequeña terminal gráfica. La aplicación lee continuamente desde un puerto serie y muestra todo lo recibido en una ventana de texto.

## Requisitos

- Python 3
- [pyserial](https://pypi.org/project/pyserial/)

Puedes instalar las dependencias con:

```bash
pip install -r requirements.txt
```

## Uso

Ejecuta el archivo `terminal_interface.py` indicando el puerto serie y la velocidad de baudios si son diferentes de los valores por defecto (`/dev/ttyUSB0` y `9600`):

```bash
python terminal_interface.py
```

Al cerrar la ventana la conexión se cierra de forma segura.
