import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { useData } from '../hooks/useData';
import PurchaseModal from './PurchaseModal';
import ActorModal from './ActorModal';

interface LotFinancialDetailsProps {
  lotId: string;
  userId: string;
  onBack: () => void;
}

const LotFinancialDetails: React.FC<LotFinancialDetailsProps> = ({ lotId, userId, onBack }) => {
  const { lots, purchases, actors, deletePurchase, deleteActor, getFinancialSummary } = useData(userId);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showActorModal, setShowActorModal] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editingActor, setEditingActor] = useState(null);

  const lot = lots.find(l => l.id === lotId);
  const lotPurchases = purchases.filter(p => p.lotId === lotId);
  const lotActors = actors.filter(a => a.lotId === lotId);
  const summary = getFinancialSummary(lotId);

  const handleEditPurchase = (purchase: any) => {
    setEditingPurchase(purchase);
    setShowPurchaseModal(true);
  };

  const handleEditActor = (actor: any) => {
    setEditingActor(actor);
    setShowActorModal(true);
  };

  const handleDeletePurchase = (purchase: any) => {
    if (window.confirm(`¿Está seguro de eliminar la compra de ${purchase.buyerName}?`)) {
      deletePurchase(purchase.id);
    }
  };

  const handleDeleteActor = (actor: any) => {
    if (window.confirm(`¿Está seguro de eliminar el actor ${actor.name}?`)) {
      deleteActor(actor.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'delivered':
        return 'Entregada';
      case 'paid':
        return 'Pagada';
      default:
        return 'Desconocido';
    }
  };

  const getActorTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine_supplier':
        return 'bg-red-100 text-red-800';
      case 'feed_supplier':
        return 'bg-orange-100 text-orange-800';
      case 'transporter':
        return 'bg-blue-100 text-blue-800';
      case 'veterinarian':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActorTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccine_supplier':
        return 'Proveedor Vacunas';
      case 'feed_supplier':
        return 'Proveedor Alimento';
      case 'transporter':
        return 'Transportador';
      case 'veterinarian':
        return 'Veterinario';
      default:
        return 'Otro';
    }
  };

  if (!lot) {
    return <div>Lote no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard Financiero - Lote {lot.number}
              </h2>
              <p className="text-gray-600">{lot.hectares} ha • {lot.estimatedProduction} kg estimados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Financieras */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-green-600">${summary.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Costos Totales</p>
              <p className="text-2xl font-bold text-red-600">${summary.totalCosts.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROI</p>
              <p className={`text-2xl font-bold ${summary.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.roi.toFixed(1)}%
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              summary.roi >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-5 h-5 ${summary.roi >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Margen de Ganancia</p>
              <p className={`text-2xl font-bold ${summary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.profitMargin.toFixed(1)}%
              </p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              summary.profitMargin >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <span className={`text-sm font-bold ${summary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de Costos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Desglose de Costos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-red-600">Vacunas</p>
            <p className="text-xl font-bold text-red-700">${summary.costBreakdown.vaccines.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-600">Alimento</p>
            <p className="text-xl font-bold text-orange-700">${summary.costBreakdown.feed.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Transporte</p>
            <p className="text-xl font-bold text-blue-700">${summary.costBreakdown.transport.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-600">Veterinario</p>
            <p className="text-xl font-bold text-green-700">${summary.costBreakdown.veterinary.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Compras */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Compras Registradas</h3>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Compra</span>
          </button>
        </div>

        {lotPurchases.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No hay compras registradas para este lote.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comprador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio/kg
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lotPurchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{purchase.buyerName}</div>
                        <div className="text-sm text-gray-500">{purchase.buyerCompany}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{purchase.quantity} kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${purchase.pricePerKg}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${purchase.totalAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                        {getStatusLabel(purchase.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPurchase(purchase)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePurchase(purchase)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actores */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actores Involucrados</h3>
          <button
            onClick={() => setShowActorModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Actor</span>
          </button>
        </div>

        {lotActors.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No hay actores registrados para este lote.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lotActors.map(actor => (
                  <tr key={actor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getActorTypeColor(actor.type)}`}>
                        {getActorTypeLabel(actor.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{actor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{actor.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(actor.interventionDate).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${actor.cost.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditActor(actor)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteActor(actor)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {showPurchaseModal && (
        <PurchaseModal
          lotId={lotId}
          userId={userId}
          purchase={editingPurchase}
          onClose={() => {
            setShowPurchaseModal(false);
            setEditingPurchase(null);
          }}
        />
      )}

      {showActorModal && (
        <ActorModal
          lotId={lotId}
          userId={userId}
          actor={editingActor}
          onClose={() => {
            setShowActorModal(false);
            setEditingActor(null);
          }}
        />
      )}
    </div>
  );
};

export default LotFinancialDetails;