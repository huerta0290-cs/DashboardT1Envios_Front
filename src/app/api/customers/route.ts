// src/app/api/customers/top/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Obtener parámetros de la URL
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '7d';
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Generar datos simulados basados en el rango de tiempo
  const customers = generateMockTopCustomers(timeRange, limit);

  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(customers);
}

function generateMockTopCustomers(range: string, limit: number) {
  // Datos base que cambian según el rango de tiempo
  const multiplier = range === '1d' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 14;
  const guidesBase = 235 * multiplier;
  const revenueBase = 18500 * multiplier;
  
  // Datos de clientes
  const allCustomers = [
    { id: 1, name: 'APLIN', level: 'Nivel 26', guides: Math.floor(guidesBase * 0.08), revenue: Math.floor(revenueBase * 0.09), margin: 40.2, status: 'active', nps: 82, trend: [60, 65, 68, 73, 75, 72, 78] },
    { id: 2, name: 'CHICOS OLÉ', level: 'Nivel 26', guides: Math.floor(guidesBase * 0.075), revenue: Math.floor(revenueBase * 0.08), margin: 38.5, status: 'active', nps: 79, trend: [58, 60, 65, 67, 70, 68, 71] },
    { id: 3, name: 'DESIGUALEX', level: 'Nivel 10', guides: Math.floor(guidesBase * 0.065), revenue: Math.floor(revenueBase * 0.07), margin: 35.8, status: 'active', nps: 76, trend: [52, 55, 58, 62, 60, 65, 67] },
    { id: 4, name: 'CLAROSHOP', level: 'Nivel 26', guides: Math.floor(guidesBase * 0.06), revenue: Math.floor(revenueBase * 0.065), margin: 37.9, status: 'active', nps: 81, trend: [55, 58, 62, 64, 67, 70, 73] },
    { id: 5, name: 'EMISSARY', level: 'Nivel 10', guides: Math.floor(guidesBase * 0.055), revenue: Math.floor(revenueBase * 0.06), margin: 32.7, status: 'active', nps: 72, trend: [48, 50, 52, 54, 53, 56, 58] },
    { id: 6, name: 'TECH GADGETS', level: 'Nivel 10', guides: Math.floor(guidesBase * 0.05), revenue: Math.floor(revenueBase * 0.055), margin: 31.2, status: 'at_risk', nps: 68, trend: [46, 49, 51, 49, 52, 50, 51] },
    { id: 7, name: 'ZAPATERIA LÓPEZ', level: 'Nivel 1', guides: Math.floor(guidesBase * 0.045), revenue: Math.floor(revenueBase * 0.05), margin: 28.5, status: 'active', nps: 73, trend: [42, 45, 48, 50, 49, 51, 53] },
    { id: 8, name: 'SANBORNS', level: 'Nivel 26', guides: Math.floor(guidesBase * 0.04), revenue: Math.floor(revenueBase * 0.045), margin: 36.8, status: 'active', nps: 78, trend: [51, 54, 57, 60, 62, 61, 64] },
    { id: 9, name: 'PURPLIFY', level: 'Nivel 1', guides: Math.floor(guidesBase * 0.035), revenue: Math.floor(revenueBase * 0.04), margin: 27.1, status: 'inactive', nps: 65, trend: [40, 42, 44, 41, 43, 45, 42] },
    { id: 10, name: 'BOUTIQUE AMPM', level: 'Nivel 10', guides: Math.floor(guidesBase * 0.03), revenue: Math.floor(revenueBase * 0.035), margin: 30.4, status: 'active', nps: 70, trend: [44, 46, 49, 51, 50, 53, 55] },
    { id: 11, name: 'ELECTRÓNICA MAX', level: 'Nivel 10', guides: Math.floor(guidesBase * 0.025), revenue: Math.floor(revenueBase * 0.03), margin: 29.8, status: 'active', nps: 71, trend: [42, 45, 47, 49, 48, 51, 53] },
    { id: 12, name: 'MODA RÁPIDA', level: 'Nivel 1', guides: Math.floor(guidesBase * 0.022), revenue: Math.floor(revenueBase * 0.025), margin: 26.5, status: 'at_risk', nps: 67, trend: [39, 41, 43, 40, 42, 44, 41] },
    { id: 13, name: 'DEPORTES TOTAL', level: 'Nivel 10', guides: Math.floor(guidesBase * 0.02), revenue: Math.floor(revenueBase * 0.022), margin: 30.1, status: 'active', nps: 72, trend: [43, 45, 48, 50, 49, 52, 54] },
    { id: 14, name: 'LIBRERÍA CULTA', level: 'Nivel 1', guides: Math.floor(guidesBase * 0.018), revenue: Math.floor(revenueBase * 0.02), margin: 27.8, status: 'inactive', nps: 66, trend: [38, 40, 42, 39, 41, 43, 40] },
    { id: 15, name: 'TIENDAS REGALOS', level: 'Nivel 1', guides: Math.floor(guidesBase * 0.016), revenue: Math.floor(revenueBase * 0.018), margin: 26.2, status: 'active', nps: 69, trend: [41, 43, 46, 48, 47, 50, 52] }
  ];
  
  // Retornar solo el número pedido de clientes
  return allCustomers.slice(0, limit);
}
