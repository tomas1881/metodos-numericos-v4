import numpy as np


def jacobi(matrix_a, vector_b, tol, max_iter):
    if max_iter <= 0:
        raise ValueError("El número máximo de iteraciones debe ser mayor a 0.")

    a_arr = np.array(matrix_a, dtype=float)
    b_arr = np.array(vector_b, dtype=float)
    n = len(b_arr)

    for i in range(n):
        if abs(a_arr[i][i]) < 1e-15:
            raise ValueError(f"El elemento diagonal A[{i+1}][{i+1}] es cero o cercano a cero.")

    x = np.zeros(n, dtype=float)
    x_new = np.zeros(n, dtype=float)
    iterations = []
    error_porcentual = 100.0

    for k in range(max_iter):
        error_absoluto = 0.0

        for i in range(n):
            suma = sum(a_arr[i][j] * x[j] for j in range(n) if j != i)
            x_new[i] = (b_arr[i] - suma) / a_arr[i][i]
            error_absoluto = max(error_absoluto, abs(x_new[i] - x[i]))

        max_val = max(abs(x_new))
        error_porcentual = (error_absoluto / (max_val + 1e-15)) * 100 if max_val > 0 else error_absoluto * 100

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
