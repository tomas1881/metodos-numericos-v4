import sympy as sp

def biseccion(f_str, a, b, tol, max_iter):
    x = sp.Symbol('x')
    f = sp.sympify(f_str)
    f_lambdified = sp.lambdify(x, f, 'numpy')
    
    fa = f_lambdified(a)
    fb = f_lambdified(b)
    
    if fa * fb > 0:
        raise ValueError(f"La función NO cambia de signo en [{a}, {b}]")
    
    iterations = []
    c_old = a
    
    for i in range(max_iter):
        c = (a + b) / 2
        fc = f_lambdified(c)
        
        error = abs((c - c_old) / c) * 100 if i > 0 and c != 0 else None
        
        iterations.append({
            'iteracion': i + 1,
            'a': round(float(a), 8),
            'b': round(float(b), 8),
            'c': round(float(c), 8),
            'f_c': round(float(fc), 8),
            'error': round(float(error), 6) if error else None
        })
        
        if abs(fc) < 1e-15:
            return {'raiz': round(float(c), 8), 'iteraciones': iterations, 'error_final': 0, 'convergio': True}
        
        if fa * fc < 0:
            b = c
            fb = fc
        else:
            a = c
            fa = fc
        
        c_old = c
        
        if error and error < tol:
            return {'raiz': round(float(c), 8), 'iteraciones': iterations, 'error_final': round(float(error), 6), 'convergio': True}
    
    return {'raiz': round(float(c), 8), 'iteraciones': iterations, 'error_final': round(float(error), 6) if error else None, 'convergio': False}