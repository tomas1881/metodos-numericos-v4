import React, { useState } from 'react';
import { metodosAPI } from '../services/api';

export default function Simpson() {
  const [funcion, setFuncion] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [n, setN] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarPuntos, setMostrarPuntos] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!funcion) { setError('Ingresa la función'); return; }
    if (!a) { setError('Ingresa el límite inferior a'); return; }
    if (!b) { setError('Ingresa el límite superior b'); return; }
    if (!n) { setError('Ingresa el número de subintervalos n'); return; }

    setCargando(true);
    setError(null);
    
    try {
      const res = await metodosAPI.simpson({
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
      <h2 className="text-2xl font-bold text-green-600 mb-4">∫ Método de Simpson 1/3</h2>
      
      {/* Fórmula */}
      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm font-semibold text-green-800 mb-2">📐 Fórmula:</p>
        <div className="text-center">
          <p className="text-base font-mono font-bold text-green-700">
            ∫ₐᵇ f(x) dx = <span className="text-xl">h/3</span> [f(a) + 4·∑f(x<sub>impar</sub>) + 2·∑f(x<sub>par</sub>) + f(b)]
          </p>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">
          donde h = (b - a)/n &nbsp;|&nbsp; n debe ser par
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
          <div><label>Subintervalos n (par) *</label>
            <input type="number" value={n} onChange={(e) => setN(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg" required /></div>
        </div>
        
        <button type="submit" disabled={cargando}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold">
          {cargando ? '🔄 Calculando...' : '🚀 Calcular Integral'}
        </button>
      </form>
      
      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      
      {/* RESULTADO CON DESGLOSE - como la imagen */}
      {resultado && (
        <div className="mt-6 space-y-4">
          {/* Título del resultado */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 rounded-t-lg">
            <h3 className="font-bold text-center">📊 RESULTADO DE LA INTEGRAL</h3>
          </div>
          
          {/* Fórmula aplicada - como en la imagen */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">📐 FÓRMULA APLICADA:</p>
            <div className="bg-white p-3 rounded-lg border">
              <p className="font-mono text-sm text-center">
                ∫ = <span className="text-green-600 font-bold">{resultado.h_sobre_3}</span> × [
                {resultado.f_a} + 4×({resultado.suma_impares}) + 2×({resultado.suma_pares}) + {resultado.f_b} ]
              </p>
            </div>
          </div>
          
          {/* Resultado final destacado */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border-2 border-green-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-700">∫ Integral definida:</span>
              <span className="text-3xl font-bold text-green-600">{resultado.integral}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
              <div className="text-center p-2 bg-white rounded"><span className="text-gray-500">h:</span> {resultado.h}</div>
              <div className="text-center p-2 bg-white rounded"><span className="text-gray-500">h/3:</span> {resultado.h_sobre_3}</div>
              <div className="text-center p-2 bg-white rounded"><span className="text-gray-500">n:</span> {resultado.n}</div>
            </div>
          </div>
          
          {/* Desglose paso a paso - COMO EN LA IMAGEN */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-green-100 p-3 font-semibold">🔢 DESGLOSE DEL CÁLCULO:</div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono">1. h = (b - a)/n =</span>
                <span className="font-bold text-green-600">{resultado.desglose?.paso1?.split('=')[1] || resultado.h}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono">2. h/3 =</span>
                <span className="font-bold text-green-600">{resultado.h_sobre_3}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono">3. f(a) + f(b) =</span>
                <span className="font-bold text-green-600">{resultado.f_a} + {resultado.f_b} = {resultado.suma_extremos}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono">4. 4 × ∑f(x_impar) =</span>
                <span className="font-bold text-green-600">4 × {resultado.suma_impares} = {resultado.termino_4_impares}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono">5. 2 × ∑f(x_par) =</span>
                <span className="font-bold text-green-600">2 × {resultado.suma_pares} = {resultado.termino_2_pares}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono">6. Suma dentro del corchete =</span>
                <span className="font-bold text-green-600">{resultado.suma_extremos} + {resultado.termino_4_impares} + {resultado.termino_2_pares} = {resultado.suma_parentesis}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-100 rounded font-bold">
                <span className="font-mono">7. ∫ = (h/3) × suma =</span>
                <span className="font-bold text-green-700 text-lg">{resultado.h_sobre_3} × {resultado.suma_parentesis} = {resultado.integral}</span>
              </div>
            </div>
          </div>
          
          {/* Términos impares */}
          {resultado.terminos_impares && resultado.terminos_impares.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-100 p-3 font-semibold">📌 Términos con coeficiente 4 (índices impares):</div>
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {resultado.terminos_impares.map((term, idx) => (
                    <div key={idx} className="flex justify-between p-1 bg-gray-50 rounded text-sm">
                      <span>i={term.i}: x={term.x}</span>
                      <span>f(x)={term['f(x)']}</span>
                      <span className="font-bold text-blue-600">{term.termino}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-blue-50 rounded text-center font-bold">
                  ∑f(x_impar) = {resultado.suma_impares}
                </div>
              </div>
            </div>
          )}
          
          {/* Términos pares */}
          {resultado.terminos_pares && resultado.terminos_pares.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-purple-100 p-3 font-semibold">📌 Términos con coeficiente 2 (índices pares):</div>
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {resultado.terminos_pares.map((term, idx) => (
                    <div key={idx} className="flex justify-between p-1 bg-gray-50 rounded text-sm">
                      <span>i={term.i}: x={term.x}</span>
                      <span>f(x)={term['f(x)']}</span>
                      <span className="font-bold text-purple-600">{term.termino}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-2 bg-purple-50 rounded text-center font-bold">
                  ∑f(x_par) = {resultado.suma_pares}
                </div>
              </div>
            </div>
          )}
          
          {/* Botón mostrar todos los puntos */}
          <button onClick={() => setMostrarPuntos(!mostrarPuntos)} className="w-full bg-gray-100 py-2 rounded-lg font-semibold">
            {mostrarPuntos ? '📖 Ocultar tabla de puntos' : `📖 Mostrar tabla de puntos (${resultado.puntos?.length})`}
          </button>
          
          {/* Tabla completa de puntos */}
          {mostrarPuntos && resultado.puntos && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden border">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-3 py-2">i</th>
                    <th className="px-3 py-2">xᵢ</th>
                    <th className="px-3 py-2">f(xᵢ)</th>
                    <th className="px-3 py-2">Coeficiente</th>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">Término</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.puntos.map((punto, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-center">{punto.i}</td>
                      <td className="px-3 py-2 text-center font-mono">{punto.x}</td>
                      <td className="px-3 py-2 text-center font-mono">{punto['f(x)']}</td>
                      <td className="px-3 py-2 text-center font-bold">
                        <span className={punto.coeficiente === 4 ? 'text-green-600' : punto.coeficiente === 2 ? 'text-blue-600' : 'text-gray-600'}>
                          {punto.coeficiente}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {punto.tipo === 'impar' && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Impar (4)</span>}
                        {punto.tipo === 'par' && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Par (2)</span>}
                        {punto.tipo === 'extremo' && <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Extremo (1)</span>}
                      </td>
                      <td className="px-3 py-2 text-center font-mono">
                        {punto.coeficiente === 4 ? `${punto.coeficiente}×${punto['f(x)']} = ${(4 * punto['f(x)']).toFixed(6)}` : 
                         punto.coeficiente === 2 ? `${punto.coeficiente}×${punto['f(x)']} = ${(2 * punto['f(x)']).toFixed(6)}` : 
                         punto['f(x)']}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Información adicional */}
          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <p className="font-semibold">ℹ️ Simpson 1/3:</p>
            <p>• La fórmula usa denominador 3 (de ahí el nombre "1/3")</p>
            <p>• Coeficiente 4 para índices impares, coeficiente 2 para índices pares</p>
            <p>• n debe ser par (se ajusta automáticamente si no lo es)</p>
            <p>• Es más preciso que el método del trapecio</p>
          </div>
        </div>
      )}
    </div>
  );
}