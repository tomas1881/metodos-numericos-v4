import React, { useState } from 'react';
import { metodosAPI } from '../services/api';

export default function GaussSeidel() {
  const [tamano, setTamano] = useState(3);
  const [matriz, setMatriz] = useState([
    [4, 1, 0],
    [1, 4, 1],
    [0, 1, 4]
  ]);
  const [vector, setVector] = useState([1, 2, 3]);
  const [tolerancia, setTolerancia] = useState('');
  const [maxIter, setMaxIter] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarIter, setMostrarIter] = useState(false);

  const cambiarTamano = (n) => {
    setTamano(n);
    const nuevaMatriz = Array(n).fill().map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) nuevaMatriz[i][i] = 4;
    for (let i = 0; i < n-1; i++) { nuevaMatriz[i][i+1] = 1; nuevaMatriz[i+1][i] = 1; }
    setMatriz(nuevaMatriz);
    setVector(Array(n).fill().map((_, i) => i+1));
  };

  const actualizarMatriz = (i, j, val) => {
    const nueva = [...matriz];
    nueva[i][j] = parseFloat(val) || 0;
    setMatriz(nueva);
  };

  const actualizarVector = (i, val) => {
    const nuevo = [...vector];
    nuevo[i] = parseFloat(val) || 0;
    setVector(nuevo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tolerancia) { setError('Ingresa la tolerancia'); return; }
    if (!maxIter) { setError('Ingresa el máximo de iteraciones'); return; }

    setCargando(true);
    setError(null);
    
    try {
      const res = await metodosAPI.gaussSeidel({
        A: matriz,
        b: vector,
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
      <h2 className="text-2xl font-bold text-pink-600 mb-4">⚡ Método de Gauss-Seidel</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Tamaño de la matriz:</label>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map(n => (
            <button key={n} type="button" onClick={() => cambiarTamano(n)}
              className={`px-4 py-2 rounded-lg ${tamano === n ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
              {n} x {n}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Matriz A:</label>
          <div className="overflow-x-auto">
            {matriz.map((fila, i) => (
              <div key={i} className="flex justify-center mb-1">
                {fila.map((val, j) => (
                  <input key={j} type="number" step="any" value={val} onChange={(e) => actualizarMatriz(i, j, e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-center mx-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Vector b:</label>
          <div className="flex justify-center gap-2">
            {vector.map((val, i) => (
              <input key={i} type="number" step="any" value={val} onChange={(e) => actualizarVector(i, e.target.value)}
                className="w-20 px-2 py-1 border rounded text-center" />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><label>Tolerancia (%) *</label><input type="number" step="any" value={tolerancia} onChange={(e) => setTolerancia(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required /></div>
          <div><label>Máx. iteraciones *</label><input type="number" value={maxIter} onChange={(e) => setMaxIter(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required /></div>
        </div>
        
        <button type="submit" disabled={cargando}
          className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 rounded-lg font-semibold">
          {cargando ? '🔄 Resolviendo...' : '🚀 Resolver Sistema'}
        </button>
      </form>
      
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="bg-pink-50 p-4 rounded-lg">
            <div className="font-semibold mb-2">Solución:</div>
            {resultado.solucion.map((val, i) => (
              <div key={i} className="flex justify-between"><span>x{i+1} =</span><span className="font-bold text-pink-600">{val}</span></div>
            ))}
            <div className="flex justify-between mt-2"><span>Error final:</span><span>{resultado.error_final}%</span></div>
          </div>
          
          <button onClick={() => setMostrarIter(!mostrarIter)} className="w-full bg-gray-100 py-2 rounded-lg">
            {mostrarIter ? 'Ocultar' : 'Mostrar'} iteraciones ({resultado.iteraciones?.length})
          </button>
          
          {mostrarIter && resultado.iteraciones && (
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-pink-600 text-white"><tr><th>Iter</th>{resultado.solucion.map((_, i) => <th key={i}>x{i+1}</th>)}<th>Error%</th></tr></thead>
                <tbody>
                  {resultado.iteraciones.map((iter, idx) => (
                    <tr key={idx} className="border-b"><td className="p-2 text-center">{iter.iteracion}</td>
                      {iter.x.map((val, i) => <td key={i} className="p-2 font-mono">{val}</td>)}
                      <td className="p-2">{iter.error_porcentual}%</td></tr>
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