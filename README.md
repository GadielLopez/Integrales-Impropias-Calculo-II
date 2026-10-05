# Calculadora y Graficador de Integrales Impropias

Proyecto desarrollado para el curso de **Cálculo II**.

La aplicación permite resolver, analizar y representar gráficamente integrales impropias mediante una interfaz matemática interactiva.

## Características

- Editor matemático visual.
- Fracciones representadas de forma matemática.
- Exponentes enteros y fraccionarios.
- Límites finitos e infinitos.
- Resolución simbólica con SymPy.
- Clasificación automática de integrales.
- Detección de singularidades.
- Separación automática por tramos.
- Análisis de convergencia y divergencia.
- Procedimiento matemático paso a paso.
- Gráfica cartesiana interactiva.
- Límites modificables desde la gráfica.
- Exploración visual de límites infinitos.
- Representación de áreas.
- Soporte para raíces y potencias racionales reales.
- Ejercicios con múltiples singularidades.
- Modo visual para exposición.

## Tecnologías utilizadas

### Backend

- Python
- FastAPI
- SymPy
- Pydantic
- Uvicorn

### Frontend

- HTML
- CSS
- JavaScript
- Plotly.js
- MathLive
- Math.js

## Estructura del proyecto

```text
IntegralesImpropias/
│
├── backend/
│   ├── core/
│   │   ├── analizador.py
│   │   └── parser_matematico.py
│   │
│   ├── main.py
│   ├── pruebas_motor.py
│   ├── pruebas_avanzadas.py
│   └── requirements.txt
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── .gitignore
└── README.md
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar al proyecto:

```bash
cd IntegralesImpropias
```

### 2. Crear el entorno virtual

En Windows:

```powershell
python -m venv .venv
```

Activarlo desde CMD:

```cmd
.venv\Scripts\activate.bat
```

O desde PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
```

### 3. Instalar dependencias

```powershell
pip install -r backend/requirements.txt
```

## Ejecutar el backend

Entrar a:

```bash
cd backend
```

Ejecutar:

```powershell
fastapi dev main.py
```

El servidor estará disponible en:

```text
http://127.0.0.1:8000
```

La documentación de la API se encuentra en:

```text
http://127.0.0.1:8000/docs
```

## Ejecutar el frontend

Abrir la carpeta del proyecto en Visual Studio Code.

Utilizar **Live Server** con:

```text
frontend/index.html
```

Normalmente estará disponible en:

```text
http://127.0.0.1:5500/frontend/index.html
```

## Pruebas del motor matemático

Desde la carpeta:

```text
backend
```

ejecutar:

```powershell
python pruebas_motor.py
```

Después:

```powershell
python pruebas_avanzadas.py
```

El motor dispone actualmente de un banco de pruebas para comprobar integrales impropias, singularidades, intervalos infinitos, potencias, funciones trigonométricas, exponenciales y otros casos.

## Ejemplo

La aplicación puede estudiar integrales como:

```text
∫[1,5] 1/(x-2)^(1/3) dx
```

Detecta automáticamente:

```text
x = 2
```

y divide el problema en:

```text
[1,2)
(2,5]
```

para evaluar correctamente los límites laterales.

## Trabajo colaborativo

Antes de comenzar a trabajar:

```bash
git pull
```

Después de realizar cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

Para nuevas funcionalidades es recomendable trabajar utilizando ramas.

Ejemplo:

```bash
git checkout -b mejora-grafica
```

## Proyecto académico

Proyecto final de **Cálculo II — 2026**.