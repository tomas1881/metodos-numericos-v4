import React from 'react';
import { metodosAPI } from '../services/api';
import SistemaLineal from './SistemaLineal';

export default function GaussSeidel() {
  return (
    <SistemaLineal
      titulo="⚡ Método de Gauss-Seidel"
      color="pink"
      apiFunc={metodosAPI.gaussSeidel}
      prefix="gs"
    />
  );
}
