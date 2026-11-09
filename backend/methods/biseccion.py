import sympy as sp


def biseccion(f_input, a, b, tol, max_iter):
    if max_iter <= 0:
        raise ValueError("El número máximo de iteraciones debe ser mayor a 0.")

    x = sp.Symbol('x')
    f_expr = f_input if isinstance(f_input, sp.Expr) else sp.sympify(str(f_input))
    f_lambdified = sp.lambdify(x, f_expr, 'numpy')

    fa = float(f_lambdified(a))
    fb = float(f_lambdified(b))

    if fa * fb > 0:
        raise ValueError(f"La función NO cambia de signo en el intervalo [{a}, {b}]")

    iterations = []
    c_old = a
    c = (a + b) / 2.0
    error = None

    for i in range(max_iter):
        c = (a + b) / 2.0
        fc = float(f_lambdified(c))

        error = abs((c - c_old) / c) * 100 if i > 0 and c != 0 else None

        iterations.append({
            'iteracion': i + 1,
            'a': round(float(a), 8),
            'b': round(float(b), 8),
            'c': round(float(c), 8),
            'f_c': round(float(fc), 8),
            'error': round(float(error), 6) if error is not None else None
        })

        if abs(fc) < 1e-15:
            return {
                'raiz': round(float(c), 8),
                'iteraciones': iterations,
                'error_final': 0,
                'convergio': True
            }

        if fa * fc < 0:
            b = c
            fb = fc
        else:
            a = c
            fa = fc

        c_old = c

        if error is not None and error < tol:
            return {
                'raiz': round(float(c), 8),
                'iteraciones': iterations,
                'error_final': round(float(error), 6),
                'convergio': True
            }

    return {
        'raiz': round(float(c), 8),
        'iteraciones': iterations,
        'error_final': round(float(error), 6) if error is not None else None,
        'convergio': False
    }
