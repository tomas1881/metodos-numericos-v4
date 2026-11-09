import React, { useState } from 'react';

export default function SistemaLineal({ titulo, color, apiFunc, prefix }) {
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
    const nuevaMatriz = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) nuevaMatriz[i][i] = 4;
    for (let i = 0; i < n - 1; i++) {
      nuevaMatriz[i][i + 1] = 1;
      nuevaMatriz[i + 1][i] = 1;
    }
    setMatriz(nuevaMatriz);
    setVector(Array.from({ length: n }, (_, i) => i + 1));
  };

  const actualizarMatriz = (i, j, val) => {
    const nueva = matriz.map((fila, rowIdx) =>
      rowIdx === i ? fila.map((v, colIdx) => (colIdx === j ? (parseFloat(val) || 0) : v)) : fila
    );
    setMatriz(nueva);
  };

  const actualizarVector = (i, val) => {
    const nuevo = vector.map((v, idx) => (idx === i ? (parseFloat(val) || 0) : v));
    setVector(nuevo);
  };

  const resolverSistema = async () => {
    if (!tolerancia) { setError('Ingresa la tolerancia'); return; }
    if (!maxIter) { setError('Ingresa el máximo de iteraciones'); return; }

    setCargando(true);
    setError(null);

    try {
      const res = await apiFunc({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    void resolverSistema();
  };

  const colorClases = {
    indigo: {
      titulo: 'text-indigo-600',
      botonActivo: 'bg-indigo-600 text-white',
      degradado: 'from-indigo-600 to-purple-600',
      fondo: 'bg-indigo-50',
      borde: 'border-indigo-100',
      textoDestacado: 'text-indigo-600',
      cabeceraTabla: 'bg-indigo-600 text-white'
    },
    pink: {
      titulo: 'text-pink-600',
      botonActivo: 'bg-pink-600 text-white',
      degradado: 'from-pink-600 to-rose-600',
      fondo: 'bg-pink-50',
      borde: 'border-pink-100',
      textoDestacado: 'text-pink-600',
      cabeceraTabla: 'bg-pink-600 text-white'
    }
  }[color] || {
    titulo: 'text-indigo-600',
    botonActivo: 'bg-indigo-600 text-white',
    degradado: 'from-indigo-600 to-purple-600',
    fondo: 'bg-indigo-50',
    borde: 'border-indigo-100',
    textoDestacado: 'text-indigo-600',
    cabeceraTabla: 'bg-indigo-600 text-white'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className={`text-2xl font-bold ${colorClases.titulo} mb-4`}>{titulo}</h2>

      <div className="mb-4">
        <label htmlFor={`${prefix}-dimensiones`} className="block text-sm font-medium mb-2">Tamaño de la matriz:</label>
        <div id={`${prefix}-dimensiones`} className="flex gap-2">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={`${prefix}-dim-${n}`}
              type="button"
              onClick={() => cambiarTamano(n)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                tamano === n ? colorClases.botonActivo : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {n} x {n}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`${prefix}-matrix-container`} className="block text-sm font-medium mb-2">Matriz A:</label>
          <div id={`${prefix}-matrix-container`} className="overflow-x-auto p-2 bg-gray-50 rounded-lg">
            {matriz.map((fila, i) => (
              <div key={`${prefix}-fila-${i}`} className="flex justify-center mb-2">
                {fila.map((val, j) => (
                  <input
                    key={`${prefix}-cell-${i}-${j}`}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => actualizarMatriz(i, j, e.target.value)}
                    aria-label={`Matriz A fila ${i + 1} columna ${j + 1}`}
                    className="w-20 px-2 py-1 border rounded text-center mx-1 bg-white"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor={`${prefix}-vector-container`} className="block text-sm font-medium mb-2">Vector b:</label>
          <div id={`${prefix}-vector-container`} className="flex justify-center gap-2 p-2 bg-gray-50 rounded-lg">
            {vector.map((val, i) => (
              <input
                key={`${prefix}-vec-${i}`}
                type="number"
                step="any"
                value={val}
                onChange={(e) => actualizarVector(i, e.target.value)}
                aria-label={`Vector b elemento ${i + 1}`}
                className="w-20 px-2 py-1 border rounded text-center bg-white"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${prefix}-tol`} className="block text-sm font-medium text-gray-700">Tolerancia (%) *</label>
            <input
              id={`${prefix}-tol`}
              type="number"
              step="any"
              value={tolerancia}
              onChange={(e) => setTolerancia(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor={`${prefix}-maxiter`} className="block text-sm font-medium text-gray-700">Máx. iteraciones *</label>
            <input
              id={`${prefix}-maxiter`}
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
          className={`w-full bg-gradient-to-r ${colorClases.degradado} text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50`}
        >
          {cargando ? '🔄 Resolviendo...' : '🚀 Resolver Sistema'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {resultado && (
        <div className="mt-6 space-y-4">
          <div className={`${colorClases.fondo} p-4 rounded-lg`}>
            <h3 className="font-semibold mb-2">Solución:</h3>
            {resultado.solucion.map((val, i) => (
              <div key={`sol-${i}`} className={`flex justify-between py-1 border-b ${colorClases.borde}`}>
                <span>x{i + 1} =</span>
                <span className={`font-bold ${colorClases.textoDestacado} font-mono`}>{val}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2 font-medium">
              <span>Error final:</span>
              <span>{resultado.error_final}%</span>
            </div>
            <div className="mt-1">
              <span>Convergencia:</span> {resultado.convergio ? '✅ Convergió' : '⚠️ No convergió'}
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
                <thead className={colorClases.cabeceraTabla}>
                  <tr>
                    <th scope="col" className="p-2">Iter</th>
                    {resultado.solucion.map((_, i) => (
                      <th scope="col" key={`th-x-${i}`} className="p-2">x{i + 1}</th>
                    ))}
                    <th scope="col" className="p-2">Error%</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {resultado.iteraciones.map((iter) => (
                    <tr key={`${prefix}-iter-${iter.iteracion}`} className="border-b">
                      <td className="p-2">{iter.iteracion}</td>
                      {iter.x.map((val, i) => (
                        <td key={`iter-x-${i}`} className="p-2 font-mono">{val}</td>
                      ))}
                      <td className="p-2 font-mono">{iter.error_porcentual}%</td>
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
