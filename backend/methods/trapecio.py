import sympy as sp


def trapecio(f_input, a, b, n):
    """
    Método del Trapecio Compuesto
    Fórmula: ∫ₐᵇ f(x) dx = (h/2)[f(a) + 2∑f(xᵢ) + f(b)]
    """
    if n <= 0:
        raise ValueError("El número de subintervalos n debe ser mayor a 0.")

    x = sp.Symbol('x')
    f_expr = f_input if isinstance(f_input, sp.Expr) else sp.sympify(str(f_input))
    f_lambdified = sp.lambdify(x, f_expr, 'numpy')

    h = (b - a) / n
    h_sobre_2 = h / 2

    f_a = float(f_lambdified(a))
    f_b = float(f_lambdified(b))

    tabla = []
    suma_interior = 0.0

    for i in range(n + 1):
        xi = a + i * h
        fxi = float(f_lambdified(xi))

        tabla.append({
            'i': i,
            'xi': round(float(xi), 6),
            'fxi': round(float(fxi), 6)
        })

        if 0 < i < n:
            suma_interior += fxi

    suma_ponderada = f_a + 2 * suma_interior + f_b
    integral = h_sobre_2 * suma_ponderada

    return {
        'integral': round(float(integral), 8),
        'h': round(h, 8),
        'h_sobre_2': round(h_sobre_2, 8),
        'n': n,
        'a': a,
        'b': b,
        'f_a': round(f_a, 6),
        'f_b': round(f_b, 6),
        'suma_interior': round(suma_interior, 6),
        'suma_ponderada': round(suma_ponderada, 6),
        'tabla': tabla,
        'metodo': 'Trapecio Compuesto',
        'formula': '∫ₐᵇ f(x) dx = (h/2)[f(a) + 2∑f(xᵢ) + f(b)]',
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
