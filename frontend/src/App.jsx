import React, { useState, useEffect } from 'react';
import { metodosAPI } from './services/api';
import MenuPrincipal from './components/MenuPrincipal';
import Biseccion from './components/Biseccion';
import NewtonRaphson from './components/NewtonRaphson';
import Simpson from './components/Simpson';
import Trapecio from './components/Trapecio';
import Interpolacion from './components/Interpolacion';
import Jacobi from './components/Jacobi';
import GaussSeidel from './components/GaussSeidel';

const COMPONENTES = {
  biseccion: Biseccion,
  newton: NewtonRaphson,
  simpson: Simpson,
  trapecio: Trapecio,
  interpolacion: Interpolacion,
  jacobi: Jacobi,
  gauss_seidel: GaussSeidel,
};

function App() {
  const [metodoActual, setMetodoActual] = useState('biseccion');
  const [metodos, setMetodos] = useState([]);
  const [conectado, setConectado] = useState(true);

  useEffect(() => {
    cargarMetodos();
  }, []);

  const cargarMetodos = async () => {
    try {
      const res = await metodosAPI.getMetodos();
      setMetodos(res.data);
      setConectado(true);
    } catch (error) {
      console.error('Error conectando al servidor:', error);
      setConectado(false);
    }
  };

  if (!conectado) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error de conexión</h2>
          <p className="text-gray-600 mb-4">
            No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo en:
            <br />
            <code className="bg-gray-100 px-2 py-1 rounded mt-2 block">http://localhost:5000</code>
          </p>
          <button onClick={cargarMetodos} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const ComponenteActual = COMPONENTES[metodoActual] || Biseccion;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            📊 Métodos Numéricos
          </h1>
          <p className="text-gray-600 mt-2">Selecciona un método e ingresa tus propios valores</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <MenuPrincipal 
            metodos={metodos}
            metodoSeleccionado={metodoActual} 
            onSelect={setMetodoActual} 
          />
          <div className="lg:col-span-2">
            <ComponenteActual />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;