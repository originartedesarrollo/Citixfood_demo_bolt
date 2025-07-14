import { useState, useEffect } from 'react';
import { Farm, Lot, TraceabilityRecord, TraceabilitySummary, Purchase, Actor, FinancialSummary } from '../types';

export const useData = (userId: string) => {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [lots, setLots] = useState<Lot[]>([]);
  const [traceabilityRecords, setTraceabilityRecords] = useState<TraceabilityRecord[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);

  useEffect(() => {
    // Cargar datos desde localStorage
    const storedFarm = localStorage.getItem(`farm_${userId}`);
    const storedLots = localStorage.getItem(`lots_${userId}`);
    const storedRecords = localStorage.getItem(`traceability_${userId}`);
    const storedPurchases = localStorage.getItem(`purchases_${userId}`);
    const storedActors = localStorage.getItem(`actors_${userId}`);

    if (storedFarm) setFarm(JSON.parse(storedFarm));
    if (storedLots) setLots(JSON.parse(storedLots));
    if (storedRecords) setTraceabilityRecords(JSON.parse(storedRecords));
    if (storedPurchases) setPurchases(JSON.parse(storedPurchases));
    if (storedActors) setActors(JSON.parse(storedActors));
  }, [userId]);

  const saveFarm = (farmData: Farm) => {
    setFarm(farmData);
    localStorage.setItem(`farm_${userId}`, JSON.stringify(farmData));
  };

  const saveLot = (lot: Lot) => {
    const updatedLots = lots.some(l => l.id === lot.id)
      ? lots.map(l => l.id === lot.id ? lot : l)
      : [...lots, lot];
    setLots(updatedLots);
    localStorage.setItem(`lots_${userId}`, JSON.stringify(updatedLots));
  };

  const deleteLot = (lotId: string) => {
    const updatedLots = lots.filter(l => l.id !== lotId);
    setLots(updatedLots);
    localStorage.setItem(`lots_${userId}`, JSON.stringify(updatedLots));
    
    // Eliminar registros de trazabilidad del lote
    const updatedRecords = traceabilityRecords.filter(r => r.lotId !== lotId);
    setTraceabilityRecords(updatedRecords);
    localStorage.setItem(`traceability_${userId}`, JSON.stringify(updatedRecords));
  };

  const saveTraceabilityRecord = (record: TraceabilityRecord) => {
    const updatedRecords = traceabilityRecords.some(r => r.id === record.id)
      ? traceabilityRecords.map(r => r.id === record.id ? record : r)
      : [...traceabilityRecords, record];
    setTraceabilityRecords(updatedRecords);
    localStorage.setItem(`traceability_${userId}`, JSON.stringify(updatedRecords));
  };

  const deleteTraceabilityRecord = (recordId: string) => {
    const updatedRecords = traceabilityRecords.filter(r => r.id !== recordId);
    setTraceabilityRecords(updatedRecords);
    localStorage.setItem(`traceability_${userId}`, JSON.stringify(updatedRecords));
  };

  const savePurchase = (purchase: Purchase) => {
    const updatedPurchases = purchases.some(p => p.id === purchase.id)
      ? purchases.map(p => p.id === purchase.id ? purchase : p)
      : [...purchases, purchase];
    setPurchases(updatedPurchases);
    localStorage.setItem(`purchases_${userId}`, JSON.stringify(updatedPurchases));
  };

  const deletePurchase = (purchaseId: string) => {
    const updatedPurchases = purchases.filter(p => p.id !== purchaseId);
    setPurchases(updatedPurchases);
    localStorage.setItem(`purchases_${userId}`, JSON.stringify(updatedPurchases));
  };

  const saveActor = (actor: Actor) => {
    const updatedActors = actors.some(a => a.id === actor.id)
      ? actors.map(a => a.id === actor.id ? actor : a)
      : [...actors, actor];
    setActors(updatedActors);
    localStorage.setItem(`actors_${userId}`, JSON.stringify(updatedActors));
  };

  const deleteActor = (actorId: string) => {
    const updatedActors = actors.filter(a => a.id !== actorId);
    setActors(updatedActors);
    localStorage.setItem(`actors_${userId}`, JSON.stringify(updatedActors));
  };

  const getTraceabilitySummary = (lotId: string): TraceabilitySummary => {
    const lotRecords = traceabilityRecords.filter(r => r.lotId === lotId);
    const growthRecords = lotRecords.filter(r => r.type === 'growth');
    const vaccineRecords = lotRecords.filter(r => r.type === 'vaccine');
    const foodRecords = lotRecords.filter(r => r.type === 'food');

    const averageGrowth = growthRecords.length > 0
      ? growthRecords.reduce((sum, r) => sum + r.quantity, 0) / growthRecords.length
      : 0;

    return {
      averageGrowth,
      totalVaccines: vaccineRecords.length,
      totalFood: foodRecords.length,
      growthHistory: growthRecords.map(r => ({
        date: r.date,
        value: r.quantity
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      vaccineHistory: vaccineRecords.map(r => ({
        date: r.date,
        name: r.name,
        quantity: r.quantity
      })),
      foodHistory: foodRecords.map(r => ({
        date: r.date,
        name: r.name,
        quantity: r.quantity
      }))
    };
  };

  const getFinancialSummary = (lotId: string): FinancialSummary => {
    const lotPurchases = purchases.filter(p => p.lotId === lotId);
    const lotActors = actors.filter(a => a.lotId === lotId);
    
    const totalRevenue = lotPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalCosts = lotActors.reduce((sum, a) => sum + a.cost, 0);
    const roi = totalCosts > 0 ? ((totalRevenue - totalCosts) / totalCosts) * 100 : 0;
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;

    const costBreakdown = {
      vaccines: lotActors.filter(a => a.type === 'vaccine_supplier').reduce((sum, a) => sum + a.cost, 0),
      feed: lotActors.filter(a => a.type === 'feed_supplier').reduce((sum, a) => sum + a.cost, 0),
      transport: lotActors.filter(a => a.type === 'transporter').reduce((sum, a) => sum + a.cost, 0),
      veterinary: lotActors.filter(a => a.type === 'veterinarian').reduce((sum, a) => sum + a.cost, 0),
      other: 0
    };

    // Agrupar ingresos por mes
    const revenueByMonth = lotPurchases.reduce((acc: any[], purchase) => {
      const month = new Date(purchase.purchaseDate).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short' 
      });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.revenue += purchase.totalAmount;
      } else {
        acc.push({ month, revenue: purchase.totalAmount });
      }
      return acc;
    }, []);
    return {
      totalRevenue,
      totalCosts,
      roi,
      profitMargin,
      costBreakdown,
      revenueByMonth
    };
  };

  return {
    farm,
    lots,
    traceabilityRecords,
    purchases,
    actors,
    saveFarm,
    saveLot,
    deleteLot,
    saveTraceabilityRecord,
    deleteTraceabilityRecord,
    savePurchase,
    deletePurchase,
    saveActor,
    deleteActor,
    getTraceabilitySummary,
    getFinancialSummary
  };
};