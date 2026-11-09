# 📊 Métodos Numéricos App

Aplicación web para resolver problemas de métodos numéricos con interfaz amigable.

## 🚀 Características

### Métodos disponibles:
- **Bisección** - Encuentra raíces por intervalos
- **Newton-Raphson** - Encuentra raíces usando derivadas
- **Simpson 1/3** - Integración numérica
- **Trapecio** - Integración numérica
- **Interpolación** (Newton, Lagrange, Lineal, Cuadrática, Cúbica)
- **Jacobi** - Sistemas lineales iterativos
- **Gauss-Seidel** - Sistemas lineales iterativos

## 🛠️ Tecnologías

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Flask + Python + SymPy
- **Despliegue**: Render + Vercel

## 📦 Instalación Local

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py