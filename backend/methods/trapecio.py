import sympy as sp

def trapecio(f_str, a, b, n):
    """
    Método del Trapecio Compuesto
    Fórmula: ∫ₐᵇ f(x) dx = (h/2)[f(a) + 2∑f(xᵢ) + f(b)]
    
    Retorna el resultado CON TABLA DE VALORES y DESGLOSE COMPLETO
    """
    x = sp.Symbol('x')
    f = sp.sympify(f_str)
    f_lambdified = sp.lambdify(x, f, 'numpy')
    
    # Calcular h
    h = (b - a) / n
    h_sobre_2 = h / 2
    
    # Evaluar extremos
    f_a = f_lambdified(a)
    f_b = f_lambdified(b)
    
    # Tabla de valores
    tabla = []
    suma_interior = 0
    
    for i in range(n + 1):
        xi = a + i * h
        fxi = f_lambdified(xi)
        
        tabla.append({
            'i': i,
            'xi': round(float(xi), 6),
            'fxi': round(float(fxi), 6)
        })
        
        # Sumar términos interiores (i = 1 a n-1) con coeficiente 2
        if 0 < i < n:
            suma_interior += fxi
    
    # Calcular la suma ponderada
    suma_ponderada = f_a + 2 * suma_interior + f_b
    
    # Integral final
    integral = h_sobre_2 * suma_ponderada
    
    # Construir el desglose paso a paso
    # Mostrar la suma de los términos interiores
    terminos_interiores = ' + '.join([f"2×{tabla[i]['fxi']}" for i in range(1, n)])
    suma_interior_texto = f"2×({' + '.join([str(tabla[i]['fxi']) for i in range(1, n)])})" if n > 1 else "0"
    
    # Calcular la suma total dentro del corchete
    suma_corchete_texto = f"{f_a} + 2({suma_interior}) + {f_b}"
    
    return {
        'integral': round(float(integral), 8),
        'h': round(h, 8),
        'h_sobre_2': round(h_sobre_2, 8),
        'n': n,
        'a': a,
        'b': b,
        'f_a': round(float(f_a), 6),
        'f_b': round(float(f_b), 6),
        'suma_interior': round(float(suma_interior), 6),
        'suma_ponderada': round(float(suma_ponderada), 6),
        'tabla': tabla,
        'metodo': 'Trapecio Compuesto',
        'formula': '∫ₐᵇ f(x) dx = (h/2)[f(a) + 2∑f(xᵢ) + f(b)]',
        
        # Desglose para mostrar en la UI
        'desglose': {
            'h': f"h = (b - a)/n = ({b} - {a})/{n} = {round(h, 6)}",
            'h_sobre_2': f"h/2 = {round(h, 6)}/2 = {round(h_sobre_2, 6)}",
            'f_a': f"f(a) = f({a}) = {round(f_a, 6)}",
            'f_b': f"f(b) = f({b}) = {round(f_b, 6)}",
            'suma_interior': f"∑f(xᵢ) = {' + '.join([str(tabla[i]['fxi']) for i in range(1, n)])} = {round(suma_interior, 6)}",
            'suma_interior_2': f"2 × ∑f(xᵢ) = 2 × {round(suma_interior, 6)} = {round(2 * suma_interior, 6)}",
            'corchete': f"f(a) + 2∑f(xᵢ) + f(b) = {round(f_a, 6)} + {round(2 * suma_interior, 6)} + {round(f_b, 6)} = {round(suma_ponderada, 6)}",
            'integral': f"I = (h/2) × [corchete] = {round(h_sobre_2, 6)} × {round(suma_ponderada, 6)} = {round(integral, 6)}"
        }
    }