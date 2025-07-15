import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, MapPin, Edit } from 'lucide-react';
import { useData } from '../hooks/useData';
import { Farm } from '../types';

interface FarmProfileProps {
  userId: string;
}

const FarmProfile: React.FC<FarmProfileProps> = ({ userId }) => {
  const { t } = useTranslation();
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
          <h2 className="text-2xl font-bold text-gray-900">{t('farm.profile_title')}</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{t('common.edit')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('farm.general_info')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('farm.farm_name')}</label>
                <p className="mt-1 text-sm text-gray-900">{farm.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('farm.location')}</label>
                <p className="mt-1 text-sm text-gray-900">{farm.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('farm.total_area')}</label>
                <p className="mt-1 text-sm text-gray-900">{farm.area} ha</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('farm.coordinates')}</label>
                <p className="mt-1 text-sm text-gray-900">
                  {farm.coordinates.lat.toFixed(6)}, {farm.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('farm.map_location')}</h3>
            <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {t('farm.map_placeholder')}
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
        {farm ? t('farm.edit_profile') : t('farm.complete_profile')}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('farm.farm_name')} *
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
              {t('farm.total_area')} *
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
            {t('farm.location')} *
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={t('farm.location_placeholder')}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('farm.coordinates')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="lat" className="block text-xs font-medium text-gray-500 mb-1">
                {t('farm.latitude')}
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
                {t('farm.longitude')}
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
                <span>{t('farm.my_location')}</span>
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
              {t('common.cancel')}
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{t('common.save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmProfile;