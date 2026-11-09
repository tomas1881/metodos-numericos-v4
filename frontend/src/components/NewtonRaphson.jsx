import React, { useState } from 'react';
import { metodosAPI } from '../services/api';

export default function NewtonRaphson() {
  const [funcion, setFuncion] = useState('');
  const [x0, setX0] = useState('');
  const [tolerancia, setTolerancia] = useState('');
  const [maxIter, setMaxIter] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarIter, setMostrarIter] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!funcion) { setError('Ingresa la función'); return; }
    if (!x0) { setError('Ingresa el valor inicial x0'); return; }

    setCargando(true);
    setError(null);

    try {
      const res = await metodosAPI.newton({
        funcion: funcion,
        x0: parseFloat(x0),
        tolerancia: parseFloat(tolerancia) || 0.001,
        max_iteraciones: parseInt(maxIter) || 100
      });
      setResultado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al resolver');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📈 Newton-Raphson</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newton-funcion" className="block text-sm font-medium text-gray-700">Función f(x) *</label>
          <input
            id="newton-funcion"
            type="text"
            value={funcion}
            onChange={(e) => setFuncion(e.target.value)}
            placeholder="Ej: x^3 - 4*x - 9"
            className="w-full px-4 py-2 border rounded-lg font-mono"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="newton-x0" className="block text-sm font-medium text-gray-700">x₀ (Valor inicial) *</label>
            <input
              id="newton-x0"
              type="number"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="newton-tol" className="block text-sm font-medium text-gray-700">Tolerancia (%)</label>
            <input
              id="newton-tol"
              type="number"
              step="any"
              value={tolerancia}
              onChange={(e) => setTolerancia(e.target.value)}
              placeholder="0.001"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label htmlFor="newton-maxiter" className="block text-sm font-medium text-gray-700">Máx. iteraciones</label>
          <input
            id="newton-maxiter"
            type="number"
            value={maxIter}
            onChange={(e) => setMaxIter(e.target.value)}
            placeholder="100"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {cargando ? '🔄 Resolviendo...' : '🚀 Resolver'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>🎯 Raíz:</span>
              <span className="text-2xl font-bold text-blue-600">{resultado.raiz}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>📉 Error final:</span>
              <span>{resultado.error_final}%</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMostrarIter(!mostrarIter)}
            className="w-full bg-gray-100 py-2 rounded-lg font-semibold hover:bg-gray-200"
          >
            {mostrarIter ? 'Ocultar' : 'Mostrar'} iteraciones ({resultado.iteraciones?.length || 0})
          </button>

          {mostrarIter && resultado.iteraciones && (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th scope="col" className="p-2">Iter</th>
                    <th scope="col" className="p-2">x_actual</th>
                    <th scope="col" className="p-2">f(x)</th>
                    <th scope="col" className="p-2">f'(x)</th>
                    <th scope="col" className="p-2">x_siguiente</th>
                    <th scope="col" className="p-2">Error%</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.iteraciones.map((iter) => (
                    <tr key={`nr-iter-${iter.iteracion}`} className="border-b text-center">
                      <td className="p-2">{iter.iteracion}</td>
                      <td className="p-2 font-mono">{iter.x_actual}</td>
                      <td className="p-2 font-mono">{iter.f_x}</td>
                      <td className="p-2 font-mono">{iter.f_prime_x}</td>
                      <td className="p-2 font-mono font-bold">{iter.x_siguiente}</td>
                      <td className="p-2">{iter.error}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
