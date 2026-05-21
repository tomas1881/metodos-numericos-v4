import numpy as np

def gauss_seidel(A, b, tol, max_iter):
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    n = len(b)
    
    x = np.zeros(n)
    iterations = []
    
    for k in range(max_iter):
        x_old = x.copy()
        error_absoluto = 0
        
        for i in range(n):
            suma = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x[i] = (b[i] - suma) / A[i][i]
            error_absoluto = max(error_absoluto, abs(x[i] - x_old[i]))
        
        error_porcentual = (error_absoluto / (max(abs(x)) + 1e-15)) * 100 if max(abs(x)) > 0 else error_absoluto * 100
        
        iterations.append({
            'iteracion': k + 1,
            'x': [round(float(val), 8) for val in x],
            'error_porcentual': round(float(error_porcentual), 6)
        })
        
        if error_porcentual < tol:
            return {
                'solucion': [round(float(val), 8) for val in x],
                'iteraciones': iterations,
                'error_final': round(float(error_porcentual), 6),
                'convergio': True,
                'tamaño': n
            }
    
    return {
        'solucion': [round(float(val), 8) for val in x],
        'iteraciones': iterations,
        'error_final': round(float(error_porcentual), 6),
        'convergio': False,
        'tamaño': n
    }