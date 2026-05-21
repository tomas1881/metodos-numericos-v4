import React, { useState } from 'react';
import { metodosAPI } from '../services/api';

export default function Trapecio() {
  const [funcion, setFuncion] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [n, setN] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!funcion) { setError('Ingresa la función'); return; }
    if (!a) { setError('Ingresa el límite inferior a'); return; }
    if (!b) { setError('Ingresa el límite superior b'); return; }
    if (!n) { setError('Ingresa el número de subintervalos n'); return; }

    setCargando(true);
    setError(null);
    
    try {
      const res = await metodosAPI.trapecio({
        funcion: funcion,
        a: parseFloat(a),
        b: parseFloat(b),
        n: parseInt(n)
      });
      setResultado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al calcular');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-yellow-600 mb-4">📐 Método del Trapecio</h2>
      
      {/* Fórmula */}
      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm font-semibold text-yellow-800 mb-2">📐 Fórmula:</p>
        <div className="text-center">
          <p className="text-base font-mono font-bold text-yellow-700">
            ∫ₐᵇ f(x) dx = <span className="text-xl">(h/2)</span> [f(a) + 2·∑f(xᵢ) + f(b)]
          </p>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          donde h = (b - a)/n
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Función f(x) *</label>
          <input type="text" value={funcion} onChange={(e) => setFuncion(e.target.value)}
            placeholder="Ej: x^2" className="w-full px-4 py-2 border rounded-lg font-mono" required />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div><label>Límite inferior a *</label>
            <input type="number" step="any" value={a} onChange={(e) => setA(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
          <div><label>Límite superior b *</label>
            <input type="number" step="any" value={b} onChange={(e) => setB(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
          <div><label>Subintervalos n *</label>
            <input type="number" value={n} onChange={(e) => setN(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
        </div>
        
        <button type="submit" disabled={cargando}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-lg font-semibold">
          {cargando ? '🔄 Calculando...' : '🚀 Calcular Integral'}
        </button>
      </form>
      
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      {/* RESULTADO CON TABLA Y DESGLOSE - como en la imagen */}
      {resultado && (
        <div className="mt-6 space-y-4">
          {/* Título del resultado */}
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-3 rounded-t-lg">
            <h3 className="font-bold text-center">📊 RESULTADO DEL MÉTODO DEL TRAPECIO</h3>
          </div>
          
          {/* Datos de entrada */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">📌 DATOS:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>f(x) = {funcion}</div>
              <div>a = {resultado.a}</div>
              <div>b = {resultado.b}</div>
              <div>n = {resultado.n}</div>
              <div className="col-span-2 font-bold">h = (b - a)/n = ({resultado.b} - {resultado.a})/{resultado.n} = {resultado.h}</div>
            </div>
          </div>
          
          {/* TABLA DE VALORES - como en la imagen */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-yellow-100 p-3 font-semibold">📋 TABLA DE VALORES:</div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-yellow-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-center">i</th>
                    <th className="px-4 py-2 text-center">xᵢ</th>
                    <th className="px-4 py-2 text-center">f(xᵢ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resultado.tabla?.map((row, idx) => (
                    <tr key={idx} className={idx === 0 || idx === resultado.tabla.length - 1 ? 'bg-yellow-50' : ''}>
                      <td className="px-4 py-2 text-center font-mono">{row.i}</td>
                      <td className="px-4 py-2 text-center font-mono">{row.xi}</td>
                      <td className="px-4 py-2 text-center font-mono">{row.fxi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2 text-sm text-gray-500 bg-gray-50">
              * Los extremos f(a) y f(b) están resaltados
            </div>
          </div>
          
          {/* DESGLOSE DE LA FÓRMULA - como en la imagen */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-yellow-100 p-3 font-semibold">🔢 DESGLOSE DE LA FÓRMULA:</div>
            <div className="p-4 space-y-3">
              <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                I = (h/2)[f(a) + 2∑f(xᵢ) + f(b)]
              </div>
              <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                I = ({resultado.h_sobre_2})[{resultado.f_a} + 2×({resultado.suma_interior}) + {resultado.f_b}]
              </div>
              <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                I = ({resultado.h_sobre_2})[{resultado.f_a} + {2 * resultado.suma_interior} + {resultado.f_b}]
              </div>
              <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                I = ({resultado.h_sobre_2}) × {resultado.suma_ponderada}
              </div>
              <div className="p-2 bg-yellow-100 rounded font-mono font-bold text-center">
                I = {resultado.integral}
              </div>
            </div>
          </div>
          
          {/* Resultado final destacado */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border-2 border-yellow-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-yellow-700">∫ Integral aproximada:</span>
              <span className="text-3xl font-bold text-yellow-600">{resultado.integral}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
              <div className="text-center p-2 bg-white rounded"><span className="text-gray-500">h:</span> {resultado.h}</div>
              <div className="text-center p-2 bg-white rounded"><span className="text-gray-500">h/2:</span> {resultado.h_sobre_2}</div>
              <div className="text-center p-2 bg-white rounded"><span className="text-gray-500">n:</span> {resultado.n}</div>
            </div>
          </div>
          
          {/* Desglose paso a paso detallado */}
          {resultado.desglose && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 font-semibold">📝 CÁLCULO PASO A PASO:</div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between p-1"><span>1.</span><span>{resultado.desglose.h}</span></div>
                <div className="flex justify-between p-1"><span>2.</span><span>{resultado.desglose.h_sobre_2}</span></div>
                <div className="flex justify-between p-1"><span>3.</span><span>{resultado.desglose.f_a}</span></div>
                <div className="flex justify-between p-1"><span>4.</span><span>{resultado.desglose.f_b}</span></div>
                {resultado.n > 1 && (
                  <>
                    <div className="flex justify-between p-1"><span>5.</span><span>{resultado.desglose.suma_interior}</span></div>
                    <div className="flex justify-between p-1"><span>6.</span><span>{resultado.desglose.suma_interior_2}</span></div>
                  </>
                )}
                <div className="flex justify-between p-1"><span>7.</span><span>{resultado.desglose.corchete}</span></div>
                <div className="flex justify-between p-1 font-bold text-yellow-700"><span>8.</span><span>{resultado.desglose.integral}</span></div>
              </div>
            </div>
          )}
          
          {/* Información adicional */}
          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-semibold">ℹ️ Método del Trapecio:</p>
            <p>• Aproxima el área bajo la curva usando trapecios</p>
            <p>• A mayor n, mayor precisión</p>
            <p>• Fórmula: (h/2)[f(a) + 2∑f(xᵢ) + f(b)]</p>
          </div>
        </div>
      )}
    </div>
  );
}