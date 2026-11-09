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

  const ejecutarCalculo = async () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    void ejecutarCalculo();
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="simpson-funcion" className="block text-sm font-medium text-gray-700">Función f(x) *</label>
          <input
            id="simpson-funcion"
            type="text"
            value={funcion}
            onChange={(e) => setFuncion(e.target.value)}
            placeholder="Ej: x^2"
            className="w-full px-4 py-2 border rounded-lg font-mono"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="simpson-a" className="block text-sm font-medium text-gray-700">Límite a *</label>
            <input
              id="simpson-a"
              type="number"
              step="any"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="simpson-b" className="block text-sm font-medium text-gray-700">Límite b *</label>
            <input
              id="simpson-b"
              type="number"
              step="any"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="simpson-n" className="block text-sm font-medium text-gray-700">Subintervalos n (par) *</label>
            <input
              id="simpson-n"
              type="number"
              value={n}
              onChange={(e) => setN(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {cargando ? '🔄 Calculando...' : '🚀 Calcular Integral'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {resultado && (
        <div className="mt-6 space-y-4">
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

          {resultado.terminos_impares && resultado.terminos_impares.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-100 p-3 font-semibold">📌 Términos con coeficiente 4 (índices impares):</div>
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {resultado.terminos_impares.map((term) => (
                    <div key={`imp-${term.i}`} className="flex justify-between p-1 bg-gray-50 rounded text-sm">
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

          {resultado.terminos_pares && resultado.terminos_pares.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-purple-100 p-3 font-semibold">📌 Términos con coeficiente 2 (índices pares):</div>
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {resultado.terminos_pares.map((term) => (
                    <div key={`par-${term.i}`} className="flex justify-between p-1 bg-gray-50 rounded text-sm">
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

          <button
            type="button"
            onClick={() => setMostrarPuntos(!mostrarPuntos)}
            className="w-full bg-gray-100 py-2 rounded-lg font-semibold hover:bg-gray-200"
          >
            {mostrarPuntos ? '📖 Ocultar tabla de puntos' : `📖 Mostrar tabla de puntos (${resultado.puntos?.length || 0})`}
          </button>

          {mostrarPuntos && resultado.puntos && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th scope="col" className="px-4 py-2">i</th>
                    <th scope="col" className="px-4 py-2">xᵢ</th>
                    <th scope="col" className="px-4 py-2">f(xᵢ)</th>
                    <th scope="col" className="px-4 py-2">Coeficiente</th>
                    <th scope="col" className="px-4 py-2">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-center">
                  {resultado.puntos.map((punto) => (
                    <tr key={`punto-${punto.i}-${punto.x}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{punto.i}</td>
                      <td className="px-4 py-2 font-mono">{punto.x}</td>
                      <td className="px-4 py-2 font-mono">{punto['f(x)']}</td>
                      <td className="px-4 py-2 font-bold">{punto.coeficiente}</td>
                      <td className="px-4 py-2 capitalize">{punto.tipo}</td>
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
