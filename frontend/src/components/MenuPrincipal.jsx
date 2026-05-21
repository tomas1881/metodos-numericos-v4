import React from 'react';

const ICONOS = {
  biseccion: '📊',
  newton: '📈',
  simpson: '∫',
  trapecio: '📐',
  interpolacion: '📏',
  jacobi: '🔄',
  gauss_seidel: '⚡',
};

const COLORES = {
  biseccion: 'bg-purple-600',
  newton: 'bg-blue-600',
  simpson: 'bg-green-600',
  trapecio: 'bg-yellow-600',
  interpolacion: 'bg-red-600',
  jacobi: 'bg-indigo-600',
  gauss_seidel: 'bg-pink-600',
};

export default function MenuPrincipal({ metodos, metodoSeleccionado, onSelect }) {
  if (metodos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📌 Métodos Numéricos</h2>
      <div className="space-y-2">
        {metodos.map((metodo) => (
          <button
            key={metodo.id}
            onClick={() => onSelect(metodo.id)}
            className={`w-full p-3 rounded-lg text-left transition-all transform hover:scale-105 ${
              metodoSeleccionado === metodo.id
                ? `${COLORES[metodo.id]} text-white shadow-md`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{ICONOS[metodo.id] || '📐'}</span>
              <div>
                <div className="font-medium">{metodo.nombre}</div>
                <div className="text-xs opacity-80">{metodo.tipo}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}