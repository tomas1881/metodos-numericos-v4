import sympy as sp

def newton_raphson(f_str, x0, tol, max_iter):
    x = sp.Symbol('x')
    f = sp.sympify(f_str)
    f_prime = sp.diff(f, x)
    
    f_lambdified = sp.lambdify(x, f, 'numpy')
    fp_lambdified = sp.lambdify(x, f_prime, 'numpy')
    
    iterations = []
    x_actual = x0
    
    for i in range(max_iter):
        fx = f_lambdified(x_actual)
        fpx = fp_lambdified(x_actual)
        
        if abs(fpx) < 1e-12:
            raise ValueError("Derivada demasiado pequeña")
        
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
            return {'raiz': round(float(x_siguiente), 8), 'iteraciones': iterations, 'error_final': round(float(error), 6), 'convergio': True}
        
        x_actual = x_siguiente
    
    return {'raiz': round(float(x_siguiente), 8), 'iteraciones': iterations, 'error_final': round(float(error), 6), 'convergio': False}