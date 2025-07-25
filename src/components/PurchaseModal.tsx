import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X } from 'lucide-react';
import { useData } from '../hooks/useData';
import { Purchase } from '../types';

interface PurchaseModalProps {
  lotId: string;
  userId: string;
  purchase?: Purchase;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ lotId, userId, purchase, onClose }) => {
  const { t } = useTranslation();
  const { savePurchase } = useData(userId);
  const [formData, setFormData] = useState<Partial<Purchase>>({
    buyerName: purchase?.buyerName || '',
    buyerCompany: purchase?.buyerCompany || '',
    quantity: purchase?.quantity || 0,
    pricePerKg: purchase?.pricePerKg || 0,
    totalAmount: purchase?.totalAmount || 0,
    purchaseDate: purchase?.purchaseDate || new Date().toISOString().split('T')[0],
    deliveryDate: purchase?.deliveryDate || '',
    status: purchase?.status || 'pending',
    paymentMethod: purchase?.paymentMethod || 'transfer'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const purchaseData: Purchase = {
      id: purchase?.id || Date.now().toString(),
      lotId,
      buyerName: formData.buyerName || '',
      buyerCompany: formData.buyerCompany || '',
      quantity: formData.quantity || 0,
      pricePerKg: formData.pricePerKg || 0,
      totalAmount: (formData.quantity || 0) * (formData.pricePerKg || 0),
      purchaseDate: formData.purchaseDate || '',
      deliveryDate: formData.deliveryDate || '',
      status: formData.status || 'pending',
      paymentMethod: formData.paymentMethod || 'transfer'
    };

    savePurchase(purchaseData);
    onClose();
  };

  const calculateTotal = () => {
    return (formData.quantity || 0) * (formData.pricePerKg || 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {purchase ? t('purchases.edit_purchase') : t('purchases.add_purchase')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="buyerName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.buyer_name')} *
              </label>
              <input
                id="buyerName"
                type="text"
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="buyerCompany" className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.buyer_company')} *
              </label>
              <input
                id="buyerCompany"
                type="text"
                value={formData.buyerCompany}
                onChange={(e) => setFormData({ ...formData, buyerCompany: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.quantity_kg')} *
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
              <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.price_per_kg_usd')} *
              </label>
              <input
                id="pricePerKg"
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.total_usd')}
              </label>
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-medium">
                ${calculateTotal().toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.purchase_date')} *
              </label>
              <input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.delivery_date')}
              </label>
              <input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="pending">{t('purchases.status.pending')}</option>
                <option value="confirmed">{t('purchases.status.confirmed')}</option>
                <option value="delivered">{t('purchases.status.delivered')}</option>
                <option value="paid">{t('purchases.status.paid')}</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                {t('purchases.payment_method')} *
              </label>
              <select
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="transfer">{t('purchases.payment_methods.transfer')}</option>
                <option value="cash">{t('purchases.payment_methods.cash')}</option>
                <option value="check">{t('purchases.payment_methods.check')}</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{purchase ? t('common.edit') : t('common.save')} {t('purchases.purchase_date')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;
