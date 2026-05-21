import sympy as sp
import numpy as np

def interpolacion_newton(x_points, y_points):
    n = len(x_points)
    
    dd = np.zeros((n, n))
    dd[:, 0] = y_points
    
    for j in range(1, n):
        for i in range(n - j):
            dd[i][j] = (dd[i+1][j-1] - dd[i][j-1]) / (x_points[i+j] - x_points[i])
    
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
        L_i = 1
        for j in range(n):
            if j != i:
                L_i *= (x - x_points[j]) / (x_points[i] - x_points[j])
        polinomio += y_points[i] * L_i
    
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
    
    x = sp.Symbol('x')
    polinomio = y0 + (y1 - y0)/(x1 - x0) * (x - x0)
    polinomio = sp.expand(polinomio)
    
    return {
        'polinomio': str(polinomio),
        'pendiente': round((y1 - y0)/(x1 - x0), 6),
        'puntos': {'x': x_points, 'y': y_points},
        'metodo': 'Lineal'
    }


def interpolacion_cuadratica(x_points, y_points):
    if len(x_points) != 3:
        raise ValueError("Interpolación cuadrática requiere exactamente 3 puntos")
    
    n = 3
    dd = np.zeros((n, n))
    dd[:, 0] = y_points
    
    for j in range(1, n):
        for i in range(n - j):
            dd[i][j] = (dd[i+1][j-1] - dd[i][j-1]) / (x_points[i+j] - x_points[i])
    
    x = sp.Symbol('x')
    polinomio = dd[0][0] + dd[0][1]*(x - x_points[0]) + dd[0][2]*(x - x_points[0])*(x - x_points[1])
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
    
    n = 4
    dd = np.zeros((n, n))
    dd[:, 0] = y_points
    
    for j in range(1, n):
        for i in range(n - j):
            dd[i][j] = (dd[i+1][j-1] - dd[i][j-1]) / (x_points[i+j] - x_points[i])
    
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
        x0, x1 = x_points[i], x_points[i+1]
        y0, y1 = y_points[i], y_points[i+1]
        
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
    x = sp.Symbol('x')
    
    h = [x_points[i+1] - x_points[i] for i in range(n-1)]
    
    A = np.zeros((n, n))
    b = np.zeros(n)
    
    for i in range(1, n-1):
        A[i][i-1] = h[i-1]
        A[i][i] = 2 * (h[i-1] + h[i])
        A[i][i+1] = h[i]
        b[i] = 3 * ((y_points[i+1] - y_points[i]) / h[i] - (y_points[i] - y_points[i-1]) / h[i-1])
    
    A[0][0] = 1
    A[n-1][n-1] = 1
    
    try:
        m = np.linalg.solve(A, b)
    except:
        m = np.zeros(n)
    
    segmentos = []
    
    for i in range(n-1):
        xi = x_points[i]
        xi1 = x_points[i+1]
        yi = y_points[i]
        yi1 = y_points[i+1]
        mi = m[i]
        mi1 = m[i+1]
        
        termino1 = yi
        termino2 = (yi1 - yi) / h[i] - (h[i] / 6) * (mi1 + 2 * mi)
        termino3 = mi / 2
        termino4 = (mi1 - mi) / (6 * h[i])
        
        polinomio = termino1 + termino2*(x - xi) + termino3*(x - xi)**2 + termino4*(x - xi)**3
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