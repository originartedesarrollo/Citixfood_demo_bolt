import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useData } from '../hooks/useData';
import { TraceabilityRecord } from '../types';

interface TraceabilityDetailsProps {
  lotId: string;
  userId: string;
  onBack: () => void;
}

const TraceabilityDetails: React.FC<TraceabilityDetailsProps> = ({ lotId, userId, onBack }) => {
  const { t } = useTranslation();
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
    status: 'initiated',
    // Campos para vacunas y alimentos
    expirationDate: '',
    manufacturingYear: '',
    qualityCertificate: '',
    sanitaryRegistry: '',
    manufacturer: '',
    batchNumber: '',
    // Campos para agua
    waterPh: 7.0,
    waterType: 'potable',
    waterSource: '',
    chlorineLevel: 0,
    hardness: 0,
    temperature: 20,
    // Campos para crecimiento
    weight: 0,
    age: 0,
    feedConversion: 0,
    mortality: 0,
    healthStatus: 'good',
    environmentalTemp: 25,
    humidity: 60
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
        status: 'initiated',
        // Campos para vacunas y alimentos
        expirationDate: '',
        manufacturingYear: new Date().getFullYear().toString(),
        qualityCertificate: '',
        sanitaryRegistry: '',
        manufacturer: '',
        batchNumber: '',
        // Campos para agua
        waterPh: 7.0,
        waterType: 'potable',
        waterSource: '',
        chlorineLevel: 0,
        hardness: 0,
        temperature: 20,
        // Campos para crecimiento
        weight: 0,
        age: 0,
        feedConversion: 0,
        mortality: 0,
        healthStatus: 'good',
        environmentalTemp: 25,
        humidity: 60
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
      status: formData.status || 'initiated',
      // Campos para vacunas y alimentos
      expirationDate: formData.expirationDate,
      manufacturingYear: formData.manufacturingYear,
      qualityCertificate: formData.qualityCertificate,
      sanitaryRegistry: formData.sanitaryRegistry,
      manufacturer: formData.manufacturer,
      batchNumber: formData.batchNumber,
      // Campos para agua
      waterPh: formData.waterPh,
      waterType: formData.waterType,
      waterSource: formData.waterSource,
      chlorineLevel: formData.chlorineLevel,
      hardness: formData.hardness,
      temperature: formData.temperature,
      // Campos para crecimiento
      weight: formData.weight,
      age: formData.age,
      feedConversion: formData.feedConversion,
      mortality: formData.mortality,
      healthStatus: formData.healthStatus,
      environmentalTemp: formData.environmentalTemp,
      humidity: formData.humidity
    };

    saveTraceabilityRecord(recordData);
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (record: TraceabilityRecord) => {
    if (window.confirm(t('traceability.delete_confirmation'))) {
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

  const isVaccineOrFood = formData.type === 'vaccine' || formData.type === 'food';
  const isWater = formData.type === 'water';
  const isGrowth = formData.type === 'growth';

  // Preparar datos para la gráfica de crecimiento
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (!lot) {
    return <div>{t('common.not_found')}</div>;
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
              <span>{t('common.back')}</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t('traceability.title')} - {t('lots.lot_number')} {lot.number}
              </h2>
              <p className="text-gray-600">{lot.hectares} ha • {lot.estimatedProduction} kg {t('lots.estimated_production').toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('traceability.add_record')}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('traceability.average_growth')}</p>
              <p className="text-2xl font-bold text-green-600">{summary.averageGrowth.toFixed(1)} cm</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('traceability.vaccines_applied')}</p>
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
              <p className="text-sm font-medium text-gray-600">{t('traceability.food_registered')}</p>
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
              <p className="text-sm font-medium text-gray-600">{t('traceability.total_records')}</p>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('traceability.growth_evolution')}</h3>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {t('traceability.average_growth')}: {summary.averageGrowth.toFixed(1)} cm
              </p>
              <p className="text-sm text-gray-600">
                {summary.growthHistory.length} {t('traceability.measurements_recorded')}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">{t('traceability.last_record')}:</p>
                  <p className="text-green-600">
                    {summary.growthHistory[summary.growthHistory.length - 1]?.value} cm
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">{t('common.date')}:</p>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('traceability.title')} - {t('traceability.records')}</h3>
        
        {lotRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">{t('traceability.no_records')}</p>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{t('traceability.add_first_record')}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('traceability.record_type')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('traceability.manufacturer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.quantity')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('traceability.expiration_date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lotRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                        {t(`traceability.types.${record.type}`)}
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
                      {record.batchNumber && (
                        <div className="text-xs text-gray-500">Lote: {record.batchNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.manufacturer || '-'}</div>
                      {record.sanitaryRegistry && (
                        <div className="text-xs text-gray-500">Reg: {record.sanitaryRegistry}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.quantity} {t(`traceability.units.${record.unit}`)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.expirationDate ? 
                          new Date(record.expirationDate).toLocaleDateString('es-ES') : 
                          '-'
                        }
                      </div>
                      {record.manufacturingYear && (
                        <div className="text-xs text-gray-500">Fab: {record.manufacturingYear}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {t(`lots.status.${record.status}`)}
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
              {editingRecord ? t('traceability.edit_record') : t('traceability.add_new_record')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('traceability.record_type')} *
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
                  <option value="growth">{t('traceability.types.growth')}</option>
                  <option value="vaccine">{t('traceability.types.vaccine')}</option>
                  <option value="food">{t('traceability.types.food')}</option>
                  <option value="water">{t('traceability.types.water')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.date')} *
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
                  {t('common.name')} *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={t('traceability.name_placeholder')}
                  required
                />
              </div>

              {/* Campos adicionales para vacunas y alimentos */}
              {isVaccineOrFood && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">
                    {t('traceability.product_details')}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.manufacturer')} *
                      </label>
                      <input
                        id="manufacturer"
                        type="text"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Ej: Pfizer, Zoetis, etc."
                        required={isVaccineOrFood}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.batch_number')} *
                      </label>
                      <input
                        id="batchNumber"
                        type="text"
                        value={formData.batchNumber}
                        onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Ej: LOT123456"
                        required={isVaccineOrFood}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.expiration_date')} *
                      </label>
                      <input
                        id="expirationDate"
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required={isVaccineOrFood}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="manufacturingYear" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.manufacturing_year')} *
                      </label>
                      <input
                        id="manufacturingYear"
                        type="number"
                        min="2020"
                        max="2030"
                        value={formData.manufacturingYear}
                        onChange={(e) => setFormData({ ...formData, manufacturingYear: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required={isVaccineOrFood}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-blue-900">
                      {t('traceability.regulatory_info')}
                    </h4>
                    
                    <div>
                      <label htmlFor="sanitaryRegistry" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.sanitiary_registry')} (USA) *
                      </label>
                      <input
                        id="sanitaryRegistry"
                        type="text"
                        value={formData.sanitaryRegistry}
                        onChange={(e) => setFormData({ ...formData, sanitaryRegistry: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Ej: FDA-12345, USDA-VET-789"
                        required={isVaccineOrFood}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="qualityCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.quality_certificate')} *
                      </label>
                      <input
                        id="qualityCertificate"
                        type="text"
                        value={formData.qualityCertificate}
                        onChange={(e) => setFormData({ ...formData, qualityCertificate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Ej: ISO-9001, GMP-2024"
                        required={isVaccineOrFood}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos adicionales para agua */}
              {isWater && (
                <div className="space-y-4 p-4 bg-cyan-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-cyan-900 mb-3">
                    {t('traceability.water_details')}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="waterPh" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.water_ph')} *
                      </label>
                      <input
                        id="waterPh"
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        value={formData.waterPh}
                        onChange={(e) => setFormData({ ...formData, waterPh: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="6.5 - 8.5"
                        required={isWater}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="waterType" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.water_type')} *
                      </label>
                      <select
                        id="waterType"
                        value={formData.waterType}
                        onChange={(e) => setFormData({ ...formData, waterType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required={isWater}
                      >
                        <option value="potable">{t('water_types.potable')}</option>
                        <option value="well">{t('water_types.well')}</option>
                        <option value="treated">{t('water_types.treated')}</option>
                        <option value="spring">{t('water_types.spring')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="waterSource" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('traceability.water_source')} *
                    </label>
                    <input
                      id="waterSource"
                      type="text"
                      value={formData.waterSource}
                      onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ej: Pozo artesiano #3, Red municipal, etc."
                      required={isWater}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="chlorineLevel" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.chlorine_level')} *
                      </label>
                      <input
                        id="chlorineLevel"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.chlorineLevel}
                        onChange={(e) => setFormData({ ...formData, chlorineLevel: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="0.2 - 2.0"
                        required={isWater}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="hardness" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.water_hardness')} *
                      </label>
                      <input
                        id="hardness"
                        type="number"
                        min="0"
                        value={formData.hardness}
                        onChange={(e) => setFormData({ ...formData, hardness: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="50 - 300"
                        required={isWater}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.water_temperature')} *
                      </label>
                      <input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="18 - 25"
                        required={isWater}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Campos adicionales para crecimiento */}
              {isGrowth && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-green-900 mb-3">
                    {t('traceability.growth_details')}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.weight')} *
                      </label>
                      <input
                        id="weight"
                        type="number"
                        min="0"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="1500 - 2500"
                        required={isGrowth}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.age')} *
                      </label>
                      <input
                        id="age"
                        type="number"
                        min="0"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="1 - 45"
                        required={isGrowth}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="feedConversion" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.feed_conversion')} *
                      </label>
                      <input
                        id="feedConversion"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.feedConversion}
                        onChange={(e) => setFormData({ ...formData, feedConversion: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="1.5 - 2.5"
                        required={isGrowth}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mortality" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.mortality')} *
                      </label>
                      <input
                        id="mortality"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.mortality}
                        onChange={(e) => setFormData({ ...formData, mortality: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="0 - 5"
                        required={isGrowth}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.health_status')} *
                      </label>
                      <select
                        id="healthStatus"
                        value={formData.healthStatus}
                        onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required={isGrowth}
                      >
                        <option value="excellent">{t('health_status.excellent')}</option>
                        <option value="good">{t('health_status.good')}</option>
                        <option value="regular">{t('health_status.regular')}</option>
                        <option value="poor">{t('health_status.poor')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="environmentalTemp" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.environmental_temp')} *
                      </label>
                      <input
                        id="environmentalTemp"
                        type="number"
                        step="0.1"
                        value={formData.environmentalTemp}
                        onChange={(e) => setFormData({ ...formData, environmentalTemp: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="20 - 30"
                        required={isGrowth}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('traceability.humidity')} *
                      </label>
                      <input
                        id="humidity"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.humidity}
                        onChange={(e) => setFormData({ ...formData, humidity: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="50 - 70"
                        required={isGrowth}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.quantity')} *
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
                    Unit *
                  </label>
                  <select
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="mg">{t('traceability.units.mg')}</option>
                    <option value="gr">{t('traceability.units.gr')}</option>
                    <option value="kg">{t('traceability.units.kg')}</option>
                    <option value="ml">{t('traceability.units.ml')}</option>
                    <option value="l">{t('traceability.units.l')}</option>
                    <option value="cm">{t('traceability.units.cm')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.status')} *
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="initiated">{t('lots.status.initiated')}</option>
                  <option value="completed">{t('lots.status.completed')}</option>
                  <option value="finished">{t('lots.status.finished')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('traceability.observations')}
                </label>
                <textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={t('traceability.observations_placeholder')}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingRecord ? t('common.edit') : t('common.add')} {t('traceability.record_type')}
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