import sympy as sp


def newton_raphson(f_input, x0, tol, max_iter):
    if max_iter <= 0:
        raise ValueError("El número máximo de iteraciones debe ser mayor a 0.")

    x = sp.Symbol('x')
    f_expr = f_input if isinstance(f_input, sp.Expr) else sp.sympify(str(f_input))
    f_prime = sp.diff(f_expr, x)

    f_lambdified = sp.lambdify(x, f_expr, 'numpy')
    fp_lambdified = sp.lambdify(x, f_prime, 'numpy')

    iterations = []
    x_actual = float(x0)
    x_siguiente = x_actual
    error = 100.0

    for i in range(max_iter):
        fx = float(f_lambdified(x_actual))
        fpx = float(fp_lambdified(x_actual))

        if abs(fpx) < 1e-12:
            raise ValueError("Derivada demasiado pequeña o cercana a cero.")

        x_siguiente = x_actual - fx / fpx
        error = abs((x_siguiente - x_actual) / x_siguiente) * 100 if x_siguiente != 0 else abs(x_siguiente - x_actual) * 100

        iterations.append({
            'iteracion': i + 1,
            'x_actual': round(float(x_actual), 8),
            'f_x': round(float(fx), 8),
            'f_prime_x': round(float(fpx), 8),
            'x_siguiente': round(float(x_siguiente), 8),
            'error': round(float(error), 6)
        })

        if abs(fx) < 1e-15 or error < tol:
            return {
                'raiz': round(float(x_siguiente), 8),
                'iteraciones': iterations,
                'error_final': round(float(error), 6),
                'convergio': True
            }

        x_actual = x_siguiente

    return {
        'raiz': round(float(x_siguiente), 8),
        'iteraciones': iterations,
        'error_final': round(float(error), 6),
        'convergio': False
    }
