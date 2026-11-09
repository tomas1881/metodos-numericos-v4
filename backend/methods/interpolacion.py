import sympy as sp
import numpy as np


def _calcular_diferencias_divididas(x_points, y_points):
    """Calcula la tabla de diferencias divididas de Newton."""
    n = len(x_points)
    dd = np.zeros((n, n), dtype=float)
    dd[:, 0] = y_points

    for j in range(1, n):
        for i in range(n - j):
            denominador = x_points[i + j] - x_points[i]
            if abs(denominador) < 1e-15:
                raise ValueError("Los puntos X deben ser distintos entre sí.")
            dd[i][j] = (dd[i + 1][j - 1] - dd[i][j - 1]) / denominador
    return dd


def interpolacion_newton(x_points, y_points):
    n = len(x_points)
    dd = _calcular_diferencias_divididas(x_points, y_points)

    x = sp.Symbol('x')
    polinomio = 0
    for i in range(n):
        termino = dd[0][i]
        for j in range(i):
            termino *= (x - x_points[j])
        polinomio += termino

    polinomio = sp.expand(polinomio)

    return {
        'polinomio': str(polinomio),
        'coeficientes': [round(float(dd[0][i]), 6) for i in range(n)],
        'puntos': {'x': x_points, 'y': y_points},
        'metodo': 'Newton (Diferencias Divididas)'
    }


def interpolacion_lagrange(x_points, y_points):
    n = len(x_points)
    x = sp.Symbol('x')

    polinomio = 0
    for i in range(n):
        l_i = 1
        for j in range(n):
            if j != i:
                denominador = x_points[i] - x_points[j]
                if abs(denominador) < 1e-15:
                    raise ValueError("Los puntos X no pueden repetirse.")
                l_i *= (x - x_points[j]) / denominador
        polinomio += y_points[i] * l_i

    polinomio = sp.expand(polinomio)

    return {
        'polinomio': str(polinomio),
        'puntos': {'x': x_points, 'y': y_points},
        'metodo': 'Lagrange'
    }


def interpolacion_lineal(x_points, y_points):
    if len(x_points) != 2:
        raise ValueError("Interpolación lineal requiere exactamente 2 puntos")

    x0, x1 = x_points[0], x_points[1]
    y0, y1 = y_points[0], y_points[1]

    if abs(x1 - x0) < 1e-15:
        raise ValueError("x0 y x1 deben ser diferentes")

    x = sp.Symbol('x')
    pendiente = (y1 - y0) / (x1 - x0)
    polinomio = y0 + pendiente * (x - x0)
    polinomio = sp.expand(polinomio)

    return {
        'polinomio': str(polinomio),
        'pendiente': round(pendiente, 6),
        'puntos': {'x': x_points, 'y': y_points},
        'metodo': 'Lineal'
    }


def interpolacion_cuadratica(x_points, y_points):
    if len(x_points) != 3:
        raise ValueError("Interpolación cuadrática requiere exactamente 3 puntos")

    dd = _calcular_diferencias_divididas(x_points, y_points)
    x = sp.Symbol('x')
    polinomio = dd[0][0] + dd[0][1] * (x - x_points[0]) + dd[0][2] * (x - x_points[0]) * (x - x_points[1])
    polinomio = sp.expand(polinomio)

    return {
        'polinomio': str(polinomio),
        'coeficientes': {
            'a': round(float(polinomio.coeff(x, 2)), 6),
            'b': round(float(polinomio.coeff(x, 1)), 6),
            'c': round(float(polinomio.coeff(x, 0)), 6)
        },
        'puntos': {'x': x_points, 'y': y_points},
        'metodo': 'Cuadrática'
    }


def interpolacion_cubica(x_points, y_points):
    if len(x_points) != 4:
        raise ValueError("Interpolación cúbica requiere exactamente 4 puntos")

    dd = _calcular_diferencias_divididas(x_points, y_points)
    x = sp.Symbol('x')
    polinomio = dd[0][0]
    polinomio += dd[0][1] * (x - x_points[0])
    polinomio += dd[0][2] * (x - x_points[0]) * (x - x_points[1])
    polinomio += dd[0][3] * (x - x_points[0]) * (x - x_points[1]) * (x - x_points[2])
    polinomio = sp.expand(polinomio)

    return {
        'polinomio': str(polinomio),
        'coeficientes': {
            'a': round(float(polinomio.coeff(x, 3)), 6),
            'b': round(float(polinomio.coeff(x, 2)), 6),
            'c': round(float(polinomio.coeff(x, 1)), 6),
            'd': round(float(polinomio.coeff(x, 0)), 6)
        },
        'puntos': {'x': x_points, 'y': y_points},
        'metodo': 'Cúbica'
    }


def spline_lineal(x_points, y_points):
    n = len(x_points)
    x = sp.Symbol('x')
    segmentos = []

    for i in range(n - 1):
        x0, x1 = x_points[i], x_points[i + 1]
        y0, y1 = y_points[i], y_points[i + 1]

        if abs(x1 - x0) < 1e-15:
            raise ValueError("Los puntos X consecutivos deben ser distintos")

        pendiente = (y1 - y0) / (x1 - x0)
        polinomio = y0 + pendiente * (x - x0)

        segmentos.append({
            'intervalo': [x0, x1],
            'polinomio': str(sp.expand(polinomio)),
            'pendiente': round(pendiente, 6)
        })

    return {
        'segmentos': segmentos,
        'n_segmentos': n - 1,
        'puntos': {'x': x_points, 'y': y_points},
        'metodo': 'Spline Lineal'
    }


def spline_cubico(x_points, y_points):
    n = len(x_points)
    if n < 3:
        raise ValueError("Spline cúbico requiere al menos 3 puntos")

    x = sp.Symbol('x')
    h = [x_points[i + 1] - x_points[i] for i in range(n - 1)]

    for val in h:
        if abs(val) < 1e-15:
            raise ValueError("Los puntos X deben ser estrictamente crecientes o distintos")

    matrix_a = np.zeros((n, n), dtype=float)
    vector_b = np.zeros(n, dtype=float)

    for i in range(1, n - 1):
        matrix_a[i][i - 1] = h[i - 1]
        matrix_a[i][i] = 2 * (h[i - 1] + h[i])
        matrix_a[i][i + 1] = h[i]
        vector_b[i] = 3 * ((y_points[i + 1] - y_points[i]) / h[i] - (y_points[i] - y_points[i - 1]) / h[i - 1])

    matrix_a[0][0] = 1.0
    matrix_a[n - 1][n - 1] = 1.0

    try:
        m = np.linalg.solve(matrix_a, vector_b)
    except (np.linalg.LinAlgError, ValueError):
        m = np.zeros(n, dtype=float)

    segmentos = []
    for i in range(n - 1):
        xi = x_points[i]
        xi1 = x_points[i + 1]
        yi = y_points[i]
        yi1 = y_points[i + 1]
        mi = m[i]
        mi1 = m[i + 1]

        termino1 = yi
        termino2 = (yi1 - yi) / h[i] - (h[i] / 6) * (mi1 + 2 * mi)
        termino3 = mi / 2
        termino4 = (mi1 - mi) / (6 * h[i])

        polinomio = termino1 + termino2 * (x - xi) + termino3 * (x - xi)**2 + termino4 * (x - xi)**3
        polinomio = sp.expand(polinomio)

        segmentos.append({
            'intervalo': [round(xi, 6), round(xi1, 6)],
            'polinomio': str(polinomio),
            'coeficientes': {
                'a': round(float(polinomio.coeff(x, 3)), 6) if polinomio.coeff(x, 3) != 0 else 0,
                'b': round(float(polinomio.coeff(x, 2)), 6) if polinomio.coeff(x, 2) != 0 else 0,
                'c': round(float(polinomio.coeff(x, 1)), 6),
                'd': round(float(polinomio.coeff(x, 0)), 6)
            }
        })

    return {
        'segmentos': segmentos,
        'n_segmentos': n - 1,
        'puntos': {'x': x_points, 'y': y_points},
        'segundas_derivadas': [round(float(val), 6) for val in m],
        'metodo': 'Spline Cúbico'
    }
