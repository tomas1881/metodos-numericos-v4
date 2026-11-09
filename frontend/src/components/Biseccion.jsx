import React, { useState } from 'react';
import { metodosAPI } from '../services/api';

export default function Biseccion() {
  const [funcion, setFuncion] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [tolerancia, setTolerancia] = useState('');
  const [maxIter, setMaxIter] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarIter, setMostrarIter] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!funcion) { setError('Ingresa la función'); return; }
    if (!a) { setError('Ingresa el límite inferior a'); return; }
    if (!b) { setError('Ingresa el límite superior b'); return; }
    if (!tolerancia) { setError('Ingresa la tolerancia'); return; }
    if (!maxIter) { setError('Ingresa el máximo de iteraciones'); return; }

    setCargando(true);
    setError(null);

    try {
      const res = await metodosAPI.biseccion({
        funcion: funcion,
        a: parseFloat(a),
        b: parseFloat(b),
        tolerancia: parseFloat(tolerancia),
        max_iteraciones: parseInt(maxIter)
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
      <h2 className="text-2xl font-bold text-purple-600 mb-4">📊 Método de Bisección</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="biseccion-funcion" className="block text-sm font-medium text-gray-700">Función f(x) *</label>
          <input
            id="biseccion-funcion"
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
            <label htmlFor="biseccion-a" className="block text-sm font-medium text-gray-700">Límite inferior a *</label>
            <input
              id="biseccion-a"
              type="number"
              step="any"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="biseccion-b" className="block text-sm font-medium text-gray-700">Límite superior b *</label>
            <input
              id="biseccion-b"
              type="number"
              step="any"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="biseccion-tol" className="block text-sm font-medium text-gray-700">Tolerancia (%) *</label>
            <input
              id="biseccion-tol"
              type="number"
              step="any"
              value={tolerancia}
              onChange={(e) => setTolerancia(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="biseccion-maxiter" className="block text-sm font-medium text-gray-700">Máx. iteraciones *</label>
            <input
              id="biseccion-maxiter"
              type="number"
              value={maxIter}
              onChange={(e) => setMaxIter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {cargando ? '🔄 Resolviendo...' : '🚀 Resolver'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>🎯 Raíz aproximada:</span>
              <span className="text-2xl font-bold text-purple-600">{resultado.raiz}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>📉 Error final:</span>
              <span>{resultado.error_final !== null ? `${resultado.error_final}%` : 'N/A'}</span>
            </div>
            <div className="mt-1">
              <span>Estado:</span> {resultado.convergio ? '✅ Convergió' : '⚠️ No convergió en el límite de iteraciones'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMostrarIter(!mostrarIter)}
            className="w-full bg-gray-100 py-2 rounded-lg font-semibold hover:bg-gray-200"
          >
            {mostrarIter ? 'Ocultar iteraciones' : `Mostrar iteraciones (${resultado.iteraciones?.length || 0})`}
          </button>

          {mostrarIter && resultado.iteraciones && (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th scope="col" className="p-2">Iter</th>
                    <th scope="col" className="p-2">a</th>
                    <th scope="col" className="p-2">b</th>
                    <th scope="col" className="p-2">c (punto medio)</th>
                    <th scope="col" className="p-2">f(c)</th>
                    <th scope="col" className="p-2">Error%</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.iteraciones.map((iter) => (
                    <tr key={`bis-iter-${iter.iteracion}`} className="border-b text-center">
                      <td className="p-2">{iter.iteracion}</td>
                      <td className="p-2 font-mono">{iter.a}</td>
                      <td className="p-2 font-mono">{iter.b}</td>
                      <td className="p-2 font-mono font-bold">{iter.c}</td>
                      <td className="p-2 font-mono">{iter.f_c}</td>
                      <td className="p-2">{iter.error !== null ? `${iter.error}%` : '-'}</td>
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
