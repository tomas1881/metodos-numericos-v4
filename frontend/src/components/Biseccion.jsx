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
          <label className="block text-sm font-medium text-gray-700">Función f(x) *</label>
          <input type="text" value={funcion} onChange={(e) => setFuncion(e.target.value)}
            placeholder="Ej: x^3 - 4*x - 9" className="w-full px-4 py-2 border rounded-lg font-mono" required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label>Límite inferior a *</label>
            <input type="number" step="any" value={a} onChange={(e) => setA(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
          <div><label>Límite superior b *</label>
            <input type="number" step="any" value={b} onChange={(e) => setB(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label>Tolerancia (%) *</label>
            <input type="number" step="any" value={tolerancia} onChange={(e) => setTolerancia(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
          <div><label>Máx. iteraciones *</label>
            <input type="number" value={maxIter} onChange={(e) => setMaxIter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
        </div>
        
        <button type="submit" disabled={cargando}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold">
          {cargando ? '🔄 Resolviendo...' : '🚀 Resolver'}
        </button>
      </form>
      
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between"><span>🎯 Raíz:</span><span className="text-2xl font-bold text-green-600">{resultado.raiz}</span></div>
            <div className="flex justify-between mt-2"><span>📉 Error final:</span><span>{resultado.error_final}%</span></div>
            <div className="flex justify-between"><span>✅ Convergencia:</span><span>{resultado.convergio ? 'Convergió' : 'No convergió'}</span></div>
          </div>
          
          <button onClick={() => setMostrarIter(!mostrarIter)} className="w-full bg-gray-100 py-2 rounded-lg">
            {mostrarIter ? 'Ocultar' : 'Mostrar'} iteraciones ({resultado.iteraciones?.length})
          </button>
          
          {mostrarIter && resultado.iteraciones && (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-purple-600 text-white"><tr><th>Iter</th><th>a</th><th>b</th><th>c</th><th>f(c)</th><th>Error%</th></tr></thead>
                <tbody>
                  {resultado.iteraciones.map((iter, i) => (
                    <tr key={i} className="border-b"><td className="p-2 text-center">{iter.iteracion}</td>
                      <td className="p-2 text-center font-mono">{iter.a}</td>
                      <td className="p-2 text-center font-mono">{iter.b}</td>
                      <td className="p-2 text-center font-mono font-bold">{iter.c}</td>
                      <td className="p-2 text-center font-mono">{iter.f_c}</td>
                      <td className="p-2 text-center">{iter.error}</td></tr>
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