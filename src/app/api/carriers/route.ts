// src/app/api/carriers/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Obtener parámetros de la URL
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '7d';

  // Generar datos simulados basados en el rango de tiempo
  const carriers = generateMockCarriers(timeRange);

  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(carriers);
}

function generateMockCarriers(range: string) {
  // Datos base que cambian según el rango de tiempo
  const multiplier = range === '1d' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 14;
  const guidesBase = 235 * multiplier;
  const revenueBase = 18500 * multiplier;
  
  // Datos de transportistas
  return [
    { 
      id: 1, 
      name: 'DHL', 
      guides: Math.floor(guidesBase * 0.35), 
      revenue: Math.floor(revenueBase * 0.38), 
      cost: Math.floor(revenueBase * 0.38 * 0.65), 
      margin: 35 + (Math.random() * 4 - 2),
      avgDeliveryTime: 1.8 + (Math.random() * 0.4 - 0.2),
      incidentRate: 4.2 + (Math.random() * 1 - 0.5),
      trend: [65, 68, 62, 70, 74, 78, 76],
      color: '#FFCC00'
    },
    { 
      id: 2, 
      name: 'FEDEX', 
      guides: Math.floor(guidesBase * 0.25), 
      revenue: Math.floor(revenueBase * 0.27), 
      cost: Math.floor(revenueBase * 0.27 * 0.68), 
      margin: 32 + (Math.random() * 4 - 2),
      avgDeliveryTime: 2.1 + (Math.random() * 0.4 - 0.2),
      incidentRate: 4.8 + (Math.random() * 1 - 0.5),
      trend: [55, 58, 62, 59, 63, 67, 65],
      color: '#4D148C'
    },
    { 
      id: 3, 
      name: 'UPS', 
      guides: Math.floor(guidesBase * 0.18), 
      revenue: Math.floor(revenueBase * 0.17), 
      cost: Math.floor(revenueBase * 0.17 * 0.7), 
      margin: 30 + (Math.random() * 4 - 2),
      avgDeliveryTime: 2.3 + (Math.random() * 0.4 - 0.2),
      incidentRate: 5.1 + (Math.random() * 1 - 0.5),
      trend: [42, 45, 44, 48, 46, 49, 52],
      color: '#351C15'
    },
    { 
      id: 4, 
      name: 'JT EXPRESS', 
      guides: Math.floor(guidesBase * 0.12), 
      revenue: Math.floor(revenueBase * 0.1), 
      cost: Math.floor(revenueBase * 0.1 * 0.72), 
      margin: 28 + (Math.random() * 4 - 2),
      avgDeliveryTime: 2.5 + (Math.random() * 0.4 - 0.2),
      incidentRate: 6.2 + (Math.random() * 1 - 0.5),
      trend: [32, 30, 35, 33, 38, 36, 39],
      color: '#E20000'
    },
    { 
      id: 5, 
      name: 'EXPRESS', 
      guides: Math.floor(guidesBase * 0.1), 
      revenue: Math.floor(revenueBase * 0.08), 
      cost: Math.floor(revenueBase * 0.08 * 0.75), 
      margin: 25 + (Math.random() * 4 - 2),
      avgDeliveryTime: 3.2 + (Math.random() * 0.4 - 0.2),
      incidentRate: 7.5 + (Math.random() * 1 - 0.5),
      trend: [20, 22, 24, 21, 23, 25, 24],
      color: '#00AEEF'
    }
  ];
}
