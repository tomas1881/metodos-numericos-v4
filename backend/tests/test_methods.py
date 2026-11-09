import unittest
import sympy as sp
from methods import (
    biseccion,
    newton_raphson,
    simpson,
    trapecio,
    interpolacion_newton,
    interpolacion_lineal,
    jacobi,
    gauss_seidel
)


class TestMetodosNumericos(unittest.TestCase):

    def test_biseccion(self):
        x = sp.Symbol('x')
        expr = x**2 - 4
        res = biseccion(expr, 0, 3, 0.01, 100)
        self.assertTrue(res['convergio'])
        self.assertEqual(round(res['raiz']), 2)

    def test_newton_raphson(self):
        x = sp.Symbol('x')
        expr = x**2 - 9
        res = newton_raphson(expr, 2, 0.01, 100)
        self.assertTrue(res['convergio'])
        self.assertEqual(round(res['raiz']), 3)

    def test_simpson(self):
        x = sp.Symbol('x')
        expr = x**2
        res = simpson(expr, 0, 2, 4)
        self.assertAlmostEqual(res['integral'], 8.0 / 3.0, places=4)

    def test_trapecio(self):
        x = sp.Symbol('x')
        expr = x
        res = trapecio(expr, 0, 2, 4)
        self.assertAlmostEqual(res['integral'], 2.0, places=4)

    def test_interpolacion_lineal(self):
        res = interpolacion_lineal([1, 3], [2, 6])
        self.assertEqual(res['pendiente'], 2.0)

    def test_interpolacion_newton(self):
        res = interpolacion_newton([1, 2, 3], [1, 4, 9])
        self.assertTrue('x**2' in res['polinomio'] or 'x^2' in res['polinomio'])

    def test_jacobi(self):
        matrix_a = [[4, 1], [1, 3]]
        vector_b = [1, 2]
        res = jacobi(matrix_a, vector_b, 0.01, 100)
        self.assertTrue(res['convergio'])
        self.assertEqual(len(res['solucion']), 2)

    def test_gauss_seidel(self):
        matrix_a = [[4, 1], [1, 3]]
        vector_b = [1, 2]
        res = gauss_seidel(matrix_a, vector_b, 0.01, 100)
        self.assertTrue(res['convergio'])
        self.assertEqual(len(res['solucion']), 2)


if __name__ == '__main__':
    unittest.main()
