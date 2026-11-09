import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import sympy as sp
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor
)

from methods import (
    biseccion, newton_raphson, simpson, trapecio,
    interpolacion_newton, interpolacion_lagrange,
    interpolacion_lineal, interpolacion_cuadratica,
    interpolacion_cubica, spline_lineal, spline_cubico,
    jacobi, gauss_seidel
)

app = Flask(__name__)

# Configuración CORS para API REST sin cookies de sesión (stateless)
CORS(app, resources={
    r"/*": {
        "origins": os.environ.get("ALLOWED_ORIGINS", "*").split(","),
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})  # NOSONAR: API REST stateless sin autenticación por cookies

ALLOWED_CHARS_PATTERN = re.compile(r'^[0-9a-zA-Z\s\+\-\*\/\^\(\)\.\,]+$')
ALLOWED_IDENTIFIERS = {'x', 'sin', 'cos', 'tan', 'exp', 'log', 'sqrt', 'abs', 'pi', 'e', 'E'}
TRANSFORMATIONS = standard_transformations + (implicit_multiplication_application, convert_xor)

SAFE_LOCALS = {
    'x': sp.Symbol('x'),
    'pi': sp.pi,
    'E': sp.E,
    'e': sp.E,
    'sin': sp.sin,
    'cos': sp.cos,
    'tan': sp.tan,
    'exp': sp.exp,
    'log': sp.log,
    'sqrt': sp.sqrt,
    'abs': sp.Abs
}


def matlab_to_python(expression):
    expr = expression.strip()
    # Reemplazo seguro en tiempo lineal O(N) sin retroceso catastrófico (ReDoS)
    expr = expr.replace('.^', '**').replace('^', '**')
    expr = re.sub(r'\b(e)\b', 'E', expr)
    expr = re.sub(r'(\d)([a-zA-Z])', r'\1*\2', expr)
    return expr


def validar_funcion(f_str):
    if not f_str or not isinstance(f_str, str):
        return False, "La expresión debe ser una cadena de texto no vacía."

    f_clean = f_str.strip()
    if not ALLOWED_CHARS_PATTERN.match(f_clean):
        return False, "Caracteres no permitidos en la función matemática."

    tokens = re.findall(r'[a-zA-Z_]+', f_clean)
    for token in tokens:
        if token not in ALLOWED_IDENTIFIERS:
            return False, f"Identificador no permitido: '{token}'."

    try:
        x = sp.Symbol('x')
        python_expr = matlab_to_python(f_clean)
        expr = parse_expr(
            python_expr,
            local_dict=SAFE_LOCALS,
            global_dict={"__builtins__": {}},
            transformations=TRANSFORMATIONS,
            evaluate=True
        )
        f_lambdified = sp.lambdify(x, expr, 'numpy')
        f_lambdified(1.0)
        return True, expr
    except (SyntaxError, TypeError, ValueError, ZeroDivisionError) as err:
        return False, f"Error de sintaxis matemática: {err}"
    except Exception as err:
        return False, f"Error al procesar la función: {err}"


# ============= ENDPOINTS =============

@app.route("/", methods=['GET'])
def home():
    return "API funcionando"


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
        data = request.get_json(force=True)
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = biseccion(
            expr,
            float(data.get('a')),
            float(data.get('b')),
            float(data.get('tolerancia')),
            int(data.get('max_iteraciones'))
        )
        return jsonify(resultado)
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Error interno: {e}"}), 500


@app.route('/newton', methods=['POST'])
def resolver_newton():
    try:
        data = request.get_json(force=True)
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = newton_raphson(
            expr,
            float(data.get('x0')),
            float(data.get('tolerancia')),
            int(data.get('max_iteraciones'))
        )
        return jsonify(resultado)
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Error interno: {e}"}), 500


@app.route('/simpson', methods=['POST'])
def resolver_simpson():
    try:
        data = request.get_json(force=True)
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = simpson(
            expr,
            float(data.get('a')),
            float(data.get('b')),
            int(data.get('n'))
        )
        return jsonify(resultado)
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Error interno: {e}"}), 500


@app.route('/trapecio', methods=['POST'])
def resolver_trapecio():
    try:
        data = request.get_json(force=True)
        valido, expr = validar_funcion(data.get('funcion'))
        if not valido:
            return jsonify({'error': f'Error en función: {expr}'}), 400
        resultado = trapecio(
            expr,
            float(data.get('a')),
            float(data.get('b')),
            int(data.get('n'))
        )
        return jsonify(resultado)
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Error interno: {e}"}), 500


@app.route('/interpolacion', methods=['POST'])
def resolver_interpolacion():
    try:
        data = request.get_json(force=True)
        tipo = data.get('tipo', 'newton')
        x_points = [float(x) for x in data.get('x_points', [])]
        y_points = [float(y) for y in data.get('y_points', [])]

        if len(x_points) == 0 or len(x_points) != len(y_points):
            return jsonify({'error': 'Puntos X e Y inválidos o de diferente longitud'}), 400

        interpoladores = {
            'newton': interpolacion_newton,
            'lagrange': interpolacion_lagrange,
            'lineal': interpolacion_lineal,
            'cuadratica': interpolacion_cuadratica,
            'cubica': interpolacion_cubica,
            'spline_lineal': spline_lineal,
            'spline_cubico': spline_cubico
        }

        func = interpoladores.get(tipo, interpolacion_newton)
        resultado = func(x_points, y_points)
        return jsonify(resultado)
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Error interno: {e}"}), 500


@app.route('/jacobi', methods=['POST'])
def resolver_jacobi():
    try:
        data = request.get_json(force=True)
        resultado = jacobi(
            data.get('A'),
            data.get('b'),
            float(data.get('tolerancia')),
            int(data.get('max_iteraciones'))
        )
        return jsonify(resultado)
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Error interno: {e}"}), 500


@app.route('/gauss_seidel', methods=['POST'])
def resolver_gauss_seidel():
    try:
        data = request.get_json(force=True)
        resultado = gauss_seidel(
            data.get('A'),
            data.get('b'),
            float(data.get('tolerancia')),
            int(data.get('max_iteraciones'))
        )
        return jsonify(resultado)
    except (ValueError, TypeError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"Error interno: {e}"}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "127.0.0.1")
    app.run(
        host=host,
        port=port,
        debug=False
    )
