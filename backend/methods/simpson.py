import sympy as sp


def simpson(f_input, a, b, n):
    """
    Método de Simpson 1/3 Compuesto
    Fórmula: ∫ₐᵇ f(x) dx = h/3 [f(a) + 4∑f(x_impar) + 2∑f(x_par) + f(b)]
    """
    if n <= 0:
        raise ValueError("El número de subintervalos n debe ser mayor a 0.")

    x = sp.Symbol('x')
    f_expr = f_input if isinstance(f_input, sp.Expr) else sp.sympify(str(f_input))
    f_lambdified = sp.lambdify(x, f_expr, 'numpy')

    # Asegurar que n sea par
    n_calc = n if n % 2 == 0 else n + 1

    h = (b - a) / n_calc
    h_sobre_3 = h / 3

    f_a = float(f_lambdified(a))
    f_b = float(f_lambdified(b))
    suma_extremos = f_a + f_b

    puntos = []
    suma_impares = 0.0
    suma_pares = 0.0

    terminos_impares = []
    terminos_pares = []

    for i in range(1, n_calc):
        xi = a + i * h
        fxi = float(f_lambdified(xi))

        if i % 2 == 0:
            suma_pares += fxi
            terminos_pares.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 2,
                'termino': f"2 × f({round(xi, 4)}) = {round(2 * fxi, 6)}"
            })
            puntos.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 2,
                'tipo': 'par'
            })
        else:
            suma_impares += fxi
            terminos_impares.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 4,
                'termino': f"4 × f({round(xi, 4)}) = {round(4 * fxi, 6)}"
            })
            puntos.append({
                'i': i,
                'x': round(float(xi), 6),
                'f(x)': round(float(fxi), 6),
                'coeficiente': 4,
                'tipo': 'impar'
            })

    puntos_extremos = [
        {'i': 0, 'x': round(float(a), 6), 'f(x)': round(float(f_a), 6), 'coeficiente': 1, 'tipo': 'extremo'},
        {'i': n_calc, 'x': round(float(b), 6), 'f(x)': round(float(f_b), 6), 'coeficiente': 1, 'tipo': 'extremo'}
    ]

    termino_4_impares = 4 * suma_impares
    termino_2_pares = 2 * suma_pares
    suma_parentesis = suma_extremos + termino_4_impares + termino_2_pares
    integral = h_sobre_3 * suma_parentesis

    formula_texto = f"∫ = {round(h_sobre_3, 8)} × [{round(f_a, 6)} + 4×({round(suma_impares, 6)}) + 2×({round(suma_pares, 6)}) + {round(f_b, 6)}]"
    formula_detallada = f"∫ = {round(h_sobre_3, 8)} × [{round(suma_extremos, 6)} + {round(termino_4_impares, 6)} + {round(termino_2_pares, 6)}]"

    return {
        'integral': round(float(integral), 8),
        'h': round(h, 8),
        'h_sobre_3': round(h_sobre_3, 8),
        'n': n_calc,
        'n_original': n,
        'metodo': 'Simpson 1/3 Compuesto',
        'formula': '∫ₐᵇ f(x) dx = h/3 [f(a) + 4∑f(x_impar) + 2∑f(x_par) + f(b)]',
        'f_a': round(float(f_a), 8),
        'f_b': round(float(f_b), 8),
        'suma_extremos': round(float(suma_extremos), 8),
        'suma_impares': round(float(suma_impares), 8),
        'suma_pares': round(float(suma_pares), 8),
        'termino_4_impares': round(float(termino_4_impares), 8),
        'termino_2_pares': round(float(termino_2_pares), 8),
        'suma_parentesis': round(float(suma_parentesis), 8),
        'formula_texto': formula_texto,
        'formula_detallada': formula_detallada,
        'terminos_impares': terminos_impares,
        'terminos_pares': terminos_pares,
        'puntos': puntos_extremos + puntos,
        'desglose': {
            'paso1': f"h = (b - a)/n = ({b} - {a})/{n_calc} = {round(h, 8)}",
            'paso2': f"h/3 = {round(h, 8)}/3 = {round(h_sobre_3, 8)}",
            'paso3': f"f(a) + f(b) = {round(f_a, 6)} + {round(f_b, 6)} = {round(suma_extremos, 6)}",
            'paso4': f"4 × ∑f(x_impar) = 4 × {round(suma_impares, 6)} = {round(termino_4_impares, 6)}",
            'paso5': f"2 × ∑f(x_par) = 2 × {round(suma_pares, 6)} = {round(termino_2_pares, 6)}",
            'paso6': f"Suma dentro del corchete = {round(suma_extremos, 6)} + {round(termino_4_impares, 6)} + {round(termino_2_pares, 6)} = {round(suma_parentesis, 6)}",
            'paso7': f"∫ = (h/3) × suma = {round(h_sobre_3, 8)} × {round(suma_parentesis, 6)} = {round(integral, 8)}"
        }
    }
