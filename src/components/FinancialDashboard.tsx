import React
import { useTranslation } from 'react-i18next';, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, ShoppingCart, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useData } from '../hooks/useData';
import PurchaseModal from './PurchaseModal';
import ActorModal from './ActorModal';
import LotFinancialDetails from './LotFinancialDetails';

interface FinancialDashboardProps {
  userId: string;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { lots, purchases, actors, getFinancialSummary } = useData(userId);
  const [selectedLot, setSelectedLot] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showActorModal, setShowActorModal] = useState(false);
  const [selectedLotForModal, setSelectedLotForModal] = useState<string>('');

  // Calcular métricas generales
  const totalRevenue = lots.reduce((sum, lot) => {
    const summary = getFinancialSummary(lot.id);
    return sum + summary.totalRevenue;
  }, 0);

  const totalCosts = lots.reduce((sum, lot) => {
    const summary = getFinancialSummary(lot.id);
    return sum + summary.totalCosts;
  }, 0);

  const totalProfit = totalRevenue - totalCosts;
  const overallROI = totalCosts > 0 ? ((totalProfit / totalCosts) * 100) : 0;

  const handleAddPurchase = (lotId: string) => {
    setSelectedLotForModal(lotId);
    setShowPurchaseModal(true);
  };

  const handleAddActor = (lotId: string) => {
    setSelectedLotForModal(lotId);
    setShowActorModal(true);
  };

  if (lots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('financial_dashboard.no_lots')}
          </h3>
          <p className="text-gray-600">
            {t('financial_dashboard.create_lots_first')}
          </p>
        </div>
      </div>
    );
  }

  if (selectedLot) {
    return (
      <LotFinancialDetails
        lotId={selectedLot}
        userId={userId}
        onBack={() => setSelectedLot(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Financiero</h2>
        <p className="text-gray-600">{t('financial_dashboard.analysis_description')}</p>
      </div>

      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Costos Totales</p>
              <p className="text-2xl font-bold text-red-600">${totalCosts.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ganancia Neta</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalProfit.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI General</p>
              <p className={`text-2xl font-bold ${overallROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {overallROI.toFixed(1)}%
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              overallROI >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {overallROI >= 0 ? 
                <TrendingUp className="w-5 h-5 text-green-600" /> : 
                <TrendingDown className="w-5 h-5 text-red-600" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Lotes con Análisis Financiero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lots.map(lot => {
          const summary = getFinancialSummary(lot.id);
          const lotPurchases = purchases.filter(p => p.lotId === lot.id);
          const lotActors = actors.filter(a => a.lotId === lot.id);
          
          return (
            <div key={lot.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lote {lot.number}
                  </h3>
                  <p className="text-sm text-gray-600">{lot.hectares} ha • {lot.estimatedProduction} kg</p>
                </div>
                <button
                  onClick={() => setSelectedLot(lot.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t('financial_dashboard.view_detail')}</span>
                </button>
              </div>

              {/* Métricas del Lote */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-green-600">INGRESOS</p>
                  <p className="text-lg font-bold text-green-700">${summary.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-red-600">COSTOS</p>
                  <p className="text-lg font-bold text-red-700">${summary.totalCosts.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-600">ROI</p>
                  <p className={`text-lg font-bold ${summary.roi >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {summary.roi.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-purple-600">MARGEN</p>
                  <p className={`text-lg font-bold ${summary.profitMargin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {summary.profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Resumen de Actividad */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Compras registradas:</span>
                  <span className="font-medium">{lotPurchases.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Actores involucrados:</span>
                  <span className="font-medium">{lotActors.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio promedio/kg:</span>
                  <span className="font-medium">
                    ${lotPurchases.length > 0 ? 
                      (lotPurchases.reduce((sum, p) => sum + p.pricePerKg, 0) / lotPurchases.length).toFixed(2) : 
                      '0.00'
                    }
                  </span>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddPurchase(lot.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar Compra</span>
                </button>
                <button
                  onClick={() => handleAddActor(lot.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Agregar Actor</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {showPurchaseModal && (
        <PurchaseModal
          lotId={selectedLotForModal}
          userId={userId}
          onClose={() => setShowPurchaseModal(false)}
        />
      )}

      {showActorModal && (
        <ActorModal
          lotId={selectedLotForModal}
          userId={userId}
          onClose={() => setShowActorModal(false)}
        />
      )}
    </div>
  );
};

export default FinancialDashboard;
