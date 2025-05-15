// src/app/api/customers/levels/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Obtener parámetros de la URL
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '7d';

  // Generar datos simulados para niveles de clientes
  const customerLevels = generateMockCustomerLevels(timeRange);

  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(customerLevels);
}

function generateMockCustomerLevels(range: string) {
  // Pequeñas variaciones basadas en el rango de tiempo
  const variation = range === '1d' ? 5 : range === '7d' ? 0 : range === '30d' ? -3 : 2;
  
  return [
    { name: 'Nivel 1', value: 65 + variation, color: '#8884d8' },
    { name: 'Nivel 10', value: 25 - variation/2, color: '#82ca9d' },
    { name: 'Nivel 26', value: 10 - variation/2, color: '#ffc658' }
  ];
}