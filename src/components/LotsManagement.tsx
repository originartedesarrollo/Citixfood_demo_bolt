import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { useData } from '../hooks/useData';
import { Lot } from '../types';

interface LotsManagementProps {
  userId: string;
}

const LotsManagement: React.FC<LotsManagementProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { farm, lots, saveLot, deleteLot } = useData(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [formData, setFormData] = useState<Partial<Lot>>({
    number: '',
    hectares: 0,
    estimatedProduction: 0,
    startDate: '',
    status: 'initiated'
  });

  const handleOpenModal = (lot?: Lot) => {
    if (lot) {
      setEditingLot(lot);
      setFormData(lot);
    } else {
      setEditingLot(null);
      setFormData({
        number: '',
        hectares: 0,
        estimatedProduction: 0,
        startDate: '',
        status: 'initiated'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farm) return;

    const lotData: Lot = {
      id: editingLot?.id || Date.now().toString(),
      number: formData.number || '',
      hectares: formData.hectares || 0,
      estimatedProduction: formData.estimatedProduction || 0,
      startDate: formData.startDate || '',
      status: formData.status || 'initiated',
      farmId: farm.id
    };

    saveLot(lotData);
    setIsModalOpen(false);
    setEditingLot(null);
  };

  const handleDelete = (lot: Lot) => {
    if (window.confirm(t('lots.delete_confirmation', { number: lot.number }))) {
      deleteLot(lot.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!farm) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('farm.complete_farm_first')}
          </h3>
          <p className="text-gray-600">
            {t('farm.complete_farm_description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('lots.management_title')}</h2>
            <p className="text-gray-600 mt-1">{t('lots.farm_label', { name: farm.name })}</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('lots.add_lot')}</span>
          </button>
        </div>
      </div>

      {/* Lots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lots.map(lot => (
          <div key={lot.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('lots.lot_number')} {lot.number}
                </h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lot.status)}`}>
                  {t(`lots.status.${lot.status}`)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModal(lot)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(lot)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('lots.hectares')}:</span>
                <span className="text-sm font-medium">{lot.hectares} ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('lots.estimated_production')}:</span>
                <span className="text-sm font-medium">{lot.estimatedProduction} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('lots.start_date')}:</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-medium">
                    {new Date(lot.startDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lots.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('lots.no_lots')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('lots.add_first_lot')}
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{t('lots.add_first_lot_button')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingLot ? t('lots.edit_lot') : t('lots.add_new_lot')}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('lots.lot_number')} *
                </label>
                <input
                  id="number"
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="hectares" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('lots.hectares')} *
                </label>
                <input
                  id="hectares"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hectares}
                  onChange={(e) => setFormData({ ...formData, hectares: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="estimatedProduction" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('lots.estimated_production')} *
                </label>
                <input
                  id="estimatedProduction"
                  type="number"
                  min="0"
                  value={formData.estimatedProduction}
                  onChange={(e) => setFormData({ ...formData, estimatedProduction: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('lots.start_date')} *
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
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
                  <option value="in_progress">{t('lots.status.in_progress')}</option>
                  <option value="completed">{t('lots.status.completed')}</option>
                  <option value="finished">{t('lots.status.finished')}</option>
                </select>
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
                  {editingLot ? t('common.edit') : t('common.add')} {t('lots.lot_number')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotsManagement;
