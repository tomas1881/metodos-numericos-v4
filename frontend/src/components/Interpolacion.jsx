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

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    try {
      const res = await metodosAPI.getTiposInterpolacion();
      setTipos(res.data);
    } catch (err) {
      console.error('Error cargando tipos:', err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const x_points = puntos.map(p => parseFloat(p.x));
    const y_points = puntos.map(p => parseFloat(p.y));
    
    for (let i = 0; i < x_points.length; i++) {
      if (isNaN(x_points[i])) { setError(`Punto ${i+1} - X inválido`); return; }
      if (isNaN(y_points[i])) { setError(`Punto ${i+1} - Y inválido`); return; }
    }
    
    setCargando(true);
    setError(null);
    
    try {
      const res = await metodosAPI.interpolacion({
        tipo: tipoSeleccionado,
        x_points: x_points,
        y_points: y_points
      });
      setResultado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al calcular interpolación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-4">📏 Interpolación</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de interpolación:</label>
        <div className="grid grid-cols-2 gap-2">
          {tipos.map((tipo) => (
            <button key={tipo.id} type="button" onClick={() => { setTipoSeleccionado(tipo.id); setResultado(null); }}
              className={`px-3 py-2 rounded-lg text-sm ${tipoSeleccionado === tipo.id ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>
              {tipo.nombre}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Puntos (X, Y):</label>
          {puntos.map((p, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <span className="w-8 text-sm">{idx+1}:</span>
              <input type="number" step="any" value={p.x} onChange={(e) => actualizarPunto(idx, 'x', e.target.value)}
                className="w-28 px-3 py-2 border rounded-lg text-center" placeholder="X" />
              <span>→</span>
              <input type="number" step="any" value={p.y} onChange={(e) => actualizarPunto(idx, 'y', e.target.value)}
                className="w-28 px-3 py-2 border rounded-lg text-center" placeholder="Y" />
              <button type="button" onClick={() => eliminarPunto(idx)} className="text-red-500">🗑️</button>
            </div>
          ))}
          <button type="button" onClick={agregarPunto} className="text-sm text-red-600">+ Agregar punto</button>
        </div>
        
        <button type="submit" disabled={cargando}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-semibold">
          {cargando ? '🔄 Calculando...' : '🚀 Calcular Interpolación'}
        </button>
      </form>
      
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      {resultado && (
        <div className="mt-6 space-y-4">
          {resultado.polinomio && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="font-semibold">Polinomio:</div>
              <code className="block bg-white p-2 rounded text-sm mt-1 overflow-x-auto">P(x) = {resultado.polinomio}</code>
            </div>
          )}
          
          {resultado.segmentos && (
            <div>
              <button onClick={() => setMostrarSegmentos(!mostrarSegmentos)} className="w-full bg-gray-100 py-2 rounded-lg">
                {mostrarSegmentos ? 'Ocultar' : 'Mostrar'} segmentos ({resultado.n_segmentos})
              </button>
              {mostrarSegmentos && resultado.segmentos.map((seg, i) => (
                <div key={i} className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <div>Segmento {i+1}: [{seg.intervalo[0]}, {seg.intervalo[1]}]</div>
                  <code className="text-xs">{seg.polinomio}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}