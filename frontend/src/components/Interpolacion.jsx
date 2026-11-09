import React, { useState, useEffect } from 'react';
import { metodosAPI } from '../services/api';

export default function Interpolacion() {
  const [tipos, setTipos] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('newton');
  const [puntos, setPuntos] = useState([{ x: '', y: '' }, { x: '', y: '' }]);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarSegmentos, setMostrarSegmentos] = useState(false);

  const cargarTipos = async () => {
    try {
      const res = await metodosAPI.getTiposInterpolacion();
      setTipos(res.data);
    } catch (err) {
      console.error('Error cargando tipos:', err);
    }
  };

  useEffect(() => {
    void cargarTipos();
  }, []);

  const agregarPunto = () => {
    if (puntos.length < 10) {
      setPuntos([...puntos, { x: '', y: '' }]);
    }
  };

  const eliminarPunto = (index) => {
    if (puntos.length > 2) {
      setPuntos(puntos.filter((_, i) => i !== index));
    }
  };

  const actualizarPunto = (index, campo, valor) => {
    const nuevos = [...puntos];
    nuevos[index][campo] = valor;
    setPuntos(nuevos);
  };

  const ejecutarCalculo = async () => {
    const xPoints = puntos.map(p => parseFloat(p.x));
    const yPoints = puntos.map(p => parseFloat(p.y));

    for (let i = 0; i < xPoints.length; i++) {
      if (isNaN(xPoints[i])) { setError(`Punto ${i + 1} - X inválido`); return; }
      if (isNaN(yPoints[i])) { setError(`Punto ${i + 1} - Y inválido`); return; }
    }

    setCargando(true);
    setError(null);

    try {
      const res = await metodosAPI.interpolacion({
        tipo: tipoSeleccionado,
        x_points: xPoints,
        y_points: yPoints
      });
      setResultado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al calcular interpolación');
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    void ejecutarCalculo();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">📏 Interpolación</h2>

      <div className="mb-4">
        <label htmlFor="tipo-interpolacion-select" className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de interpolación:
        </label>
        <div id="tipo-interpolacion-select" className="grid grid-cols-2 gap-2">
          {tipos.map((tipo) => (
            <button
              key={tipo.id}
              type="button"
              onClick={() => { setTipoSeleccionado(tipo.id); setResultado(null); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                tipoSeleccionado === tipo.id ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tipo.nombre}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="puntos-container" className="block text-sm font-medium text-gray-700 mb-2">Puntos (X, Y):</label>
          <div id="puntos-container" className="space-y-2">
            {puntos.map((p, idx) => (
              <div key={`pto-row-${idx}`} className="flex items-center gap-2">
                <span className="w-8 text-sm font-semibold">{idx + 1}:</span>
                <input
                  id={`punto-x-${idx}`}
                  type="number"
                  step="any"
                  value={p.x}
                  onChange={(e) => actualizarPunto(idx, 'x', e.target.value)}
                  className="w-28 px-3 py-2 border rounded-lg text-center"
                  placeholder="X"
                  aria-label={`Punto ${idx + 1} coordenada X`}
                  required
                />
                <span>→</span>
                <input
                  id={`punto-y-${idx}`}
                  type="number"
                  step="any"
                  value={p.y}
                  onChange={(e) => actualizarPunto(idx, 'y', e.target.value)}
                  className="w-28 px-3 py-2 border rounded-lg text-center"
                  placeholder="Y"
                  aria-label={`Punto ${idx + 1} coordenada Y`}
                  required
                />
                {puntos.length > 2 && (
                  <button
                    type="button"
                    onClick={() => eliminarPunto(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label={`Eliminar punto ${idx + 1}`}
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          {puntos.length < 10 && (
            <button
              type="button"
              onClick={agregarPunto}
              className="mt-3 text-sm text-red-600 font-semibold hover:text-red-800"
            >
              ➕ Agregar otro punto
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {cargando ? '🔄 Calculando...' : '🚀 Calcular Interpolación'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {resultado && (
        <div className="mt-6 space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-red-800 mb-2">🎯 Resultado: {resultado.metodo}</h3>
            {resultado.polinomio && (
              <div className="mb-2">
                <span className="font-medium text-gray-700">Polinomio: </span>
                <code className="bg-white px-2 py-1 rounded font-mono text-sm block mt-1 overflow-x-auto text-red-700 font-bold">
                  {resultado.polinomio}
                </code>
              </div>
            )}
            {resultado.pendiente !== undefined && (
              <div className="text-sm">
                <span className="font-medium">Pendiente: </span>
                <span>{resultado.pendiente}</span>
              </div>
            )}
          </div>

          {resultado.segmentos && (
            <div>
              <button
                type="button"
                onClick={() => setMostrarSegmentos(!mostrarSegmentos)}
                className="w-full bg-gray-100 py-2 rounded-lg font-semibold hover:bg-gray-200"
              >
                {mostrarSegmentos ? 'Ocultar segmentos' : `Mostrar segmentos (${resultado.segmentos.length})`}
              </button>

              {mostrarSegmentos && (
                <div className="mt-3 space-y-2">
                  {resultado.segmentos.map((seg, idx) => (
                    <div key={`seg-${idx}`} className="p-3 bg-gray-50 border rounded-lg text-sm">
                      <div className="font-semibold text-gray-700">
                        Segmento {idx + 1}: [{seg.intervalo[0]}, {seg.intervalo[1]}]
                      </div>
                      <code className="font-mono text-red-600 block mt-1">{seg.polinomio}</code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
