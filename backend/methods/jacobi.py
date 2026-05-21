import numpy as np

def jacobi(A, b, tol, max_iter):
    A = np.array(A, dtype=float)
    b = np.array(b, dtype=float)
    n = len(b)
    
    x = np.zeros(n)
    x_new = np.zeros(n)
    iterations = []
    
    for k in range(max_iter):
        error_absoluto = 0
        
        for i in range(n):
            suma = sum(A[i][j] * x[j] for j in range(n) if j != i)
            x_new[i] = (b[i] - suma) / A[i][i]
            error_absoluto = max(error_absoluto, abs(x_new[i] - x[i]))
        
        error_porcentual = (error_absoluto / (max(abs(x_new)) + 1e-15)) * 100 if max(abs(x_new)) > 0 else error_absoluto * 100
        
        iterations.append({
            'iteracion': k + 1,
            'x': [round(float(val), 8) for val in x_new],
            'error_porcentual': round(float(error_porcentual), 6)
        })
        
        if error_porcentual < tol:
            return {
                'solucion': [round(float(val), 8) for val in x_new],
                'iteraciones': iterations,
                'error_final': round(float(error_porcentual), 6),
                'convergio': True,
                'tamaño': n
            }
        
        x = x_new.copy()
    
    return {
        'solucion': [round(float(val), 8) for val in x_new],
        'iteraciones': iterations,
        'error_final': round(float(error_porcentual), 6),
        'convergio': False,
        'tamaño': n
    }