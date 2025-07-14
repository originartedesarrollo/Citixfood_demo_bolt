import React, { useState, useEffect } from 'react';
import { Save, MapPin, Edit } from 'lucide-react';
import { useData } from '../hooks/useData';
import { Farm } from '../types';

interface FarmProfileProps {
  userId: string;
}

const FarmProfile: React.FC<FarmProfileProps> = ({ userId }) => {
  const { farm, saveFarm } = useData(userId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Farm>>({
    name: '',
    location: '',
    area: 0,
    coordinates: { lat: 4.570868, lng: -74.297333 } // Bogotá por defecto
  });

  useEffect(() => {
    if (farm) {
      setFormData(farm);
    } else {
      setIsEditing(true);
    }
  }, [farm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const farmData: Farm = {
      id: farm?.id || Date.now().toString(),
      name: formData.name || '',
      location: formData.location || '',
      area: formData.area || 0,
      coordinates: formData.coordinates || { lat: 4.570868, lng: -74.297333 },
      producerId: userId,
      isComplete: true
    };
    saveFarm(farmData);
    setIsEditing(false);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  if (!isEditing && farm) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Perfil de Granja</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Granja</label>
                <p className="mt-1 text-sm text-gray-900">{farm.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                <p className="mt-1 text-sm text-gray-900">{farm.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Área Total (hectáreas)</label>
                <p className="mt-1 text-sm text-gray-900">{farm.area} ha</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Coordenadas</label>
                <p className="mt-1 text-sm text-gray-900">
                  {farm.coordinates.lat.toFixed(6)}, {farm.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación en el Mapa</h3>
            <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Mapa de ubicación de la granja
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Lat: {farm.coordinates.lat.toFixed(6)}<br />
                  Lng: {farm.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {farm ? 'Editar Perfil de Granja' : 'Completar Perfil de Granja'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Granja *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
              Área Total (hectáreas) *
            </label>
            <input
              id="area"
              type="number"
              step="0.01"
              min="0"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación (Dirección) *
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Ej: Vereda El Progreso, Municipio San Juan, Departamento"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordenadas GPS
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="lat" className="block text-xs font-medium text-gray-500 mb-1">
                Latitud
              </label>
              <input
                id="lat"
                type="number"
                step="0.000001"
                value={formData.coordinates?.lat || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  coordinates: {
                    ...formData.coordinates!,
                    lat: parseFloat(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="lng" className="block text-xs font-medium text-gray-500 mb-1">
                Longitud
              </label>
              <input
                id="lng"
                type="number"
                step="0.000001"
                value={formData.coordinates?.lng || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  coordinates: {
                    ...formData.coordinates!,
                    lng: parseFloat(e.target.value)
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleLocationClick}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Mi Ubicación</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {farm && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmProfile;