import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../hooks/useData';
import { TraceabilityRecord } from '../types';

interface TraceabilityDetailsProps {
  lotId: string;
  userId: string;
  onBack: () => void;
}

const TraceabilityDetails: React.FC<TraceabilityDetailsProps> = ({ lotId, userId, onBack }) => {
  const { lots, traceabilityRecords, saveTraceabilityRecord, deleteTraceabilityRecord, getTraceabilitySummary } = useData(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TraceabilityRecord | null>(null);
  const [formData, setFormData] = useState<Partial<TraceabilityRecord>>({
    type: 'growth',
    date: '',
    name: '',
    quantity: 0,
    unit: 'cm',
    observations: '',
    status: 'initiated'
  });

  const lot = lots.find(l => l.id === lotId);
  const lotRecords = traceabilityRecords.filter(r => r.lotId === lotId);
  const summary = getTraceabilitySummary(lotId);

  const handleOpenModal = (record?: TraceabilityRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData(record);
    } else {
      setEditingRecord(null);
      setFormData({
        type: 'growth',
        date: new Date().toISOString().split('T')[0],
        name: '',
        quantity: 0,
        unit: 'cm',
        observations: '',
        status: 'initiated'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const recordData: TraceabilityRecord = {
      id: editingRecord?.id || Date.now().toString(),
      lotId,
      type: formData.type || 'growth',
      date: formData.date || '',
      name: formData.name || '',
      quantity: formData.quantity || 0,
      unit: formData.unit || 'cm',
      observations: formData.observations || '',
      status: formData.status || 'initiated'
    };

    saveTraceabilityRecord(recordData);
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (record: TraceabilityRecord) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      deleteTraceabilityRecord(record.id);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine':
        return 'bg-red-100 text-red-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'water':
        return 'bg-blue-100 text-blue-800';
      case 'growth':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccine':
        return 'Vacuna';
      case 'food':
        return 'Alimento';
      case 'water':
        return 'Agua';
      case 'growth':
        return 'Crecimiento';
      default:
        return 'Otro';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'initiated':
        return 'Iniciado';
      case 'completed':
        return 'Completado';
      case 'finished':
        return 'Terminado';
      default:
        return 'Desconocido';
    }
  };

  const getDefaultUnit = (type: string) => {
    switch (type) {
      case 'vaccine':
        return 'ml';
      case 'food':
        return 'kg';
      case 'water':
        return 'l';
      case 'growth':
        return 'cm';
      default:
        return 'gr';
    }
  };

  // Preparar datos para la gráfica de crecimiento
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
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
                Trazabilidad - Lote {lot.number}
              </h2>
              <p className="text-gray-600">{lot.hectares} ha • {lot.estimatedProduction} kg estimados</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Registro</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crecimiento Promedio</p>
              <p className="text-2xl font-bold text-green-600">{summary.averageGrowth.toFixed(1)} cm</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vacunas Aplicadas</p>
              <p className="text-2xl font-bold text-red-600">{summary.totalVaccines}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">V</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alimentos Registrados</p>
              <p className="text-2xl font-bold text-orange-600">{summary.totalFood}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold">A</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-2xl font-bold text-blue-600">{lotRecords.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">R</span>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      {summary.growthHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución del Crecimiento</h3>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Crecimiento Promedio: {summary.averageGrowth.toFixed(1)} cm
              </p>
              <p className="text-sm text-gray-600">
                {summary.growthHistory.length} mediciones registradas
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Último registro:</p>
                  <p className="text-green-600">
                    {summary.growthHistory[summary.growthHistory.length - 1]?.value} cm
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Fecha:</p>
                  <p className="text-gray-600">
                    {formatDate(summary.growthHistory[summary.growthHistory.length - 1]?.date)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registros de Trazabilidad</h3>
        
        {lotRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No hay registros de trazabilidad para este lote.</p>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Primer Registro</span>
            </button>
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
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
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
                {lotRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                        {getTypeLabel(record.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(record.date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.quantity} {record.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal(record)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingRecord ? 'Editar Registro' : 'Agregar Nuevo Registro'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Registro *
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    type: e.target.value as any,
                    unit: getDefaultUnit(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="growth">Crecimiento</option>
                  <option value="vaccine">Vacuna</option>
                  <option value="food">Alimento</option>
                  <option value="water">Agua</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ej: Vacuna Triple, Alimento Concentrado, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad *
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad *
                  </label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="mg">mg</option>
                    <option value="gr">gr</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="cm">cm</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="initiated">Iniciado</option>
                  <option value="completed">Completado</option>
                  <option value="finished">Terminado</option>
                </select>
              </div>

              <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Observaciones adicionales..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingRecord ? 'Actualizar' : 'Crear'} Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TraceabilityDetails;