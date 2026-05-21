import sympy as sp

def simpson(f_str, a, b, n):
    """
    Método de Simpson 1/3 Compuesto
    Fórmula: ∫ₐᵇ f(x) dx = h/3 [f(a) + 4∑f(x_impar) + 2∑f(x_par) + f(b)]
    
    Retorna el resultado CON EL DESGLOSE COMPLETO de la fórmula
    """
    x = sp.Symbol('x')
    f = sp.sympify(f_str)
    f_lambdified = sp.lambdify(x, f, 'numpy')
    
    # Asegurar que n sea par
    if n % 2 != 0:
        n += 1
    
    # Calcular h
    h = (b - a) / n
    h_sobre_3 = h / 3
    
    # Evaluar extremos
    f_a = f_lambdified(a)
    f_b = f_lambdified(b)
    suma_extremos = f_a + f_b
    
    # Lista para guardar todos los puntos evaluados
    puntos = []
    
    # Sumatorias
    suma_impares = 0  # coeficiente 4
    suma_pares = 0    # coeficiente 2
    
    # Detalle de cada término
    terminos_impares = []
    terminos_pares = []
    
    for i in range(1, n):
        xi = a + i * h
        fxi = f_lambdified(xi)
        
        if i % 2 == 0:  # Índice par -> coeficiente 2
            suma_pares += fxi
            terminos_pares.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 2,
                'termino': f"2 × f({round(xi, 4)}) = {2 * round(fxi, 6)}"
            })
            puntos.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 2,
                'tipo': 'par'
            })
        else:  # Índice impar -> coeficiente 4
            suma_impares += fxi
            terminos_impares.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 4,
                'termino': f"4 × f({round(xi, 4)}) = {4 * round(fxi, 6)}"
            })
            puntos.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 4,
                'tipo': 'impar'
            })
    
    # Agregar extremos a la lista de puntos
    puntos_extremos = [
        {'i': 0, 'x': round(float(a), 6), 'f(x)': round(float(f_a), 6), 'coeficiente': 1, 'tipo': 'extremo'},
        {'i': n, 'x': round(float(b), 6), 'f(x)': round(float(f_b), 6), 'coeficiente': 1, 'tipo': 'extremo'}
    ]
    
    # Calcular término 4 × suma_impares
    termino_4_impares = 4 * suma_impares
    
    # Calcular término 2 × suma_pares
    termino_2_pares = 2 * suma_pares
    
    # Suma dentro del corchete
    suma_parentesis = suma_extremos + termino_4_impares + termino_2_pares
    
    # Integral final
    integral = h_sobre_3 * suma_parentesis
    
    # Construir la fórmula en texto
    formula_texto = f"∫ = {round(h_sobre_3, 8)} × [{round(f_a, 6)} + 4×({round(suma_impares, 6)}) + 2×({round(suma_pares, 6)}) + {round(f_b, 6)}]"
    formula_detallada = f"∫ = {round(h_sobre_3, 8)} × [{round(suma_extremos, 6)} + {round(termino_4_impares, 6)} + {round(termino_2_pares, 6)}]"
    
    return {
        'integral': round(float(integral), 8),
        'h': round(h, 8),
        'h_sobre_3': round(h_sobre_3, 8),
        'n': n,
        'n_original': n,
        'metodo': 'Simpson 1/3 Compuesto',
        'formula': '∫ₐᵇ f(x) dx = h/3 [f(a) + 4∑f(x_impar) + 2∑f(x_par) + f(b)]',
        
        # Valores de la fórmula
        'f_a': round(float(f_a), 8),
        'f_b': round(float(f_b), 8),
        'suma_extremos': round(float(suma_extremos), 8),
        'suma_impares': round(float(suma_impares), 8),
        'suma_pares': round(float(suma_pares), 8),
        'termino_4_impares': round(float(termino_4_impares), 8),
        'termino_2_pares': round(float(termino_2_pares), 8),
        'suma_parentesis': round(float(suma_parentesis), 8),
        
        # Texto de la fórmula
        'formula_texto': formula_texto,
        'formula_detallada': formula_detallada,
        
        # Lista de términos
        'terminos_impares': terminos_impares,
        'terminos_pares': terminos_pares,
        'puntos': puntos_extremos + puntos,
        
        # Para mostrar en la UI como la imagen
        'desglose': {
            'paso1': f"h = (b - a)/n = ({b} - {a})/{n} = {round(h, 8)}",
            'paso2': f"h/3 = {round(h, 8)}/3 = {round(h_sobre_3, 8)}",
            'paso3': f"f(a) + f(b) = {round(f_a, 6)} + {round(f_b, 6)} = {round(suma_extremos, 6)}",
            'paso4': f"4 × ∑f(x_impar) = 4 × {round(suma_impares, 6)} = {round(termino_4_impares, 6)}",
            'paso5': f"2 × ∑f(x_par) = 2 × {round(suma_pares, 6)} = {round(termino_2_pares, 6)}",
            'paso6': f"Suma dentro del corchete = {round(suma_extremos, 6)} + {round(termino_4_impares, 6)} + {round(termino_2_pares, 6)} = {round(suma_parentesis, 6)}",
            'paso7': f"∫ = (h/3) × suma = {round(h_sobre_3, 8)} × {round(suma_parentesis, 6)} = {round(integral, 8)}"
        }
    }