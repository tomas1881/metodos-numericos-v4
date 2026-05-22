from flask import Flask, request, jsonify
from flask_cors import CORS
import sympy as sp
import re
import os



app = Flask(__name__)
CORS(app)

# Puerto para Render
port = int(os.environ.get("PORT", 5000))

# Convertir sintaxis MATLAB a Python
def matlab_to_python(expression):
    expr = expression.strip()
    expr = re.sub(r'(\w+|\()\s*\^\s*([\d\w]+(?:\([^)]*\))?)', r'\1**\2', expr)
    expr = re.sub(r'(\w+)\.\^', r'\1**', expr)
    expr = re.sub(r'(?<!\w)e(?!\w)', 'E', expr)
    expr = re.sub(r'pi', 'pi', expr)
    expr = re.sub(r'(\d+)([a-zA-Z])', r'\1*\2', expr)
    return expr

def validar_funcion(f_str):
    try:
        x = sp.Symbol('x')
        python_expr = matlab_to_python(f_str)
        expr = sp.sympify(python_expr)
        f_lambdified = sp.lambdify(x, expr, 'numpy')
        f_lambdified(1.0)
        return True, expr
    except Exception as e:
        return False, str(e)

# Importar métodos
from methods import (
    biseccion, newton_raphson, simpson, trapecio,
    interpolacion_newton, interpolacion_lagrange,
    interpolacion_lineal, interpolacion_cuadratica,
    interpolacion_cubica, spline_lineal, spline_cubico,
    jacobi, gauss_seidel
)

# ============= ENDPOINTS =============

@app.route('/metodos', methods=['GET'])
def get_metodos():
    metodos = [
        {'id': 'biseccion', 'nombre': 'Bisección', 'tipo': 'raices'},
        {'id': 'newton', 'nombre': 'Newton-Raphson', 'tipo': 'raices'},
        {'id': 'simpson', 'nombre': 'Simpson 1/3', 'tipo': 'integracion'},
        {'id': 'trapecio', 'nombre': 'Trapecio', 'tipo': 'integracion'},
        {'id': 'interpolacion', 'nombre': 'Interpolación', 'tipo': 'interpolacion'},
        {'id': 'jacobi', 'nombre': 'Jacobi', 'tipo': 'sistemas'},
        {'id': 'gauss_seidel', 'nombre': 'Gauss-Seidel', 'tipo': 'sistemas'}
    ]
    return jsonify(metodos)

@app.route('/tipos_interpolacion', methods=['GET'])
def get_tipos_interpolacion():
    tipos = [
        {'id': 'newton', 'nombre': 'Newton (Diferencias Divididas)'},
        {'id': 'lagrange', 'nombre': 'Lagrange'},
        {'id': 'lineal', 'nombre': 'Lineal (2 puntos)'},
        {'id': 'cuadratica', 'nombre': 'Cuadrática (3 puntos)'},
        {'id': 'cubica', 'nombre': 'Cúbica (4 puntos)'},
        {'id': 'spline_lineal', 'nombre': 'Spline Lineal'},
        {'id': 'spline_cubico', 'nombre': 'Spline Cúbico Natural'}
    ]
    return jsonify(tipos)

@app.route('/biseccion', methods=['POST'])
def resolver_biseccion():
    try:
        data = request.json
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = biseccion(expr, float(data.get('a')), float(data.get('b')), 
                              float(data.get('tolerancia')), int(data.get('max_iteraciones')))
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/newton', methods=['POST'])
def resolver_newton():
    try:
        data = request.json
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = newton_raphson(expr, float(data.get('x0')), 
                                   float(data.get('tolerancia')), int(data.get('max_iteraciones')))
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/simpson', methods=['POST'])
def resolver_simpson():
    try:
        data = request.json
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = simpson(expr, float(data.get('a')), float(data.get('b')), int(data.get('n')))
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/trapecio', methods=['POST'])
def resolver_trapecio():
    try:
        data = request.json
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = trapecio(expr, float(data.get('a')), float(data.get('b')), int(data.get('n')))
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/interpolacion', methods=['POST'])
def resolver_interpolacion():
    try:
        data = request.json
        tipo = data.get('tipo', 'newton')
        x_points = data.get('x_points')
        y_points = data.get('y_points')
        
        if tipo == 'newton':
            resultado = interpolacion_newton(x_points, y_points)
        elif tipo == 'lagrange':
            resultado = interpolacion_lagrange(x_points, y_points)
        elif tipo == 'lineal':
            resultado = interpolacion_lineal(x_points, y_points)
        elif tipo == 'cuadratica':
            resultado = interpolacion_cuadratica(x_points, y_points)
        elif tipo == 'cubica':
            resultado = interpolacion_cubica(x_points, y_points)
        elif tipo == 'spline_lineal':
            resultado = spline_lineal(x_points, y_points)
        elif tipo == 'spline_cubico':
            resultado = spline_cubico(x_points, y_points)
        else:
            resultado = interpolacion_newton(x_points, y_points)
        
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/jacobi', methods=['POST'])
def resolver_jacobi():
    try:
        data = request.json
        resultado = jacobi(data.get('A'), data.get('b'), 
                          float(data.get('tolerancia')), int(data.get('max_iteraciones')))
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/gauss_seidel', methods=['POST'])
def resolver_gauss_seidel():
    try:
        data = request.json
        resultado = gauss_seidel(data.get('A'), data.get('b'), 
                                float(data.get('tolerancia')), int(data.get('max_iteraciones')))
        return jsonify(resultado)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 SERVIDOR DE MÉTODOS NUMÉRICOS")
    print("=" * 60)
    print(f"🌐 Servidor corriendo en puerto {port}")
    print("=" * 60)

    app.run(
        host='0.0.0.0',
        port=port,
        debug=False
    )