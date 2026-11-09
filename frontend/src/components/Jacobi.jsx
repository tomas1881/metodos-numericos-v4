import React from 'react';
import { metodosAPI } from '../services/api';
import SistemaLineal from './SistemaLineal';

export default function Jacobi() {
  return (
    <SistemaLineal
      titulo="🔄 Método de Jacobi"
      color="indigo"
      apiFunc={metodosAPI.jacobi}
      prefix="jacobi"
    />
  );
}
