import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useData } from '../hooks/useData';
import { Actor } from '../types';

interface ActorModalProps {
  lotId: string;
  userId: string;
  actor?: Actor;
  onClose: () => void;
}

const ActorModal: React.FC<ActorModalProps> = ({ lotId, userId, actor, onClose }) => {
  const { saveActor } = useData(userId);
  const [formData, setFormData] = useState<Partial<Actor>>({
    name: actor?.name || '',
    company: actor?.company || '',
    type: actor?.type || 'vaccine_supplier',
    contactInfo: actor?.contactInfo || '',
    interventionDate: actor?.interventionDate || new Date().toISOString().split('T')[0],
    cost: actor?.cost || 0,
    description: actor?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const actorData: Actor = {
      id: actor?.id || Date.now().toString(),
      lotId,
      name: formData.name || '',
      company: formData.company || '',
      type: formData.type || 'vaccine_supplier',
      contactInfo: formData.contactInfo || '',
      interventionDate: formData.interventionDate || '',
      cost: formData.cost || 0,
      description: formData.description || ''
    };

    saveActor(actorData);
    onClose();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccine_supplier':
        return 'Proveedor de Vacunas';
      case 'feed_supplier':
        return 'Proveedor de Alimento';
      case 'transporter':
        return 'Transportador';
      case 'veterinarian':
        return 'Veterinario';
      default:
        return 'Otro';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {actor ? 'Editar Actor' : 'Registrar Nuevo Actor'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Actor *
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="vaccine_supplier">Proveedor de Vacunas</option>
              <option value="feed_supplier">Proveedor de Alimento</option>
              <option value="transporter">Transportador</option>
              <option value="veterinarian">Veterinario</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                required
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Empresa/Compañía *
              </label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
              Información de Contacto *
            </label>
            <input
              id="contactInfo"
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Teléfono, email, etc."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="interventionDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Intervención *
              </label>
              <input
                id="interventionDate"
                type="date"
                value={formData.interventionDate}
                onChange={(e) => setFormData({ ...formData, interventionDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
                Costo (USD) *
              </label>
              <input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Servicio *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Describe el servicio o producto proporcionado..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{actor ? 'Actualizar' : 'Guardar'} Actor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActorModal;