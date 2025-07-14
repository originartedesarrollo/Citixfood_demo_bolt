import React, { useState } from 'react';
import { BarChart3, Plus, Eye } from 'lucide-react';
import { useData } from '../hooks/useData';
import TraceabilityDetails from './TraceabilityDetails';

interface TraceabilityProps {
  userId: string;
}

const Traceability: React.FC<TraceabilityProps> = ({ userId }) => {
  const { lots, traceabilityRecords, getTraceabilitySummary } = useData(userId);
  const [selectedLot, setSelectedLot] = useState<string | null>(null);

  if (lots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay lotes para trazabilidad
          </h3>
          <p className="text-gray-600">
            Primero debes crear lotes en la sección de Gestión de Lotes.
          </p>
        </div>
      </div>
    );
  }

  if (selectedLot) {
    return (
      <TraceabilityDetails
        lotId={selectedLot}
        userId={userId}
        onBack={() => setSelectedLot(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trazabilidad de Producción</h2>
        <p className="text-gray-600">Selecciona un lote para ver o agregar registros de trazabilidad.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lots.map(lot => {
          const summary = getTraceabilitySummary(lot.id);
          const lotRecords = traceabilityRecords.filter(r => r.lotId === lot.id);
          
          return (
            <div key={lot.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lote {lot.number}
                  </h3>
                  <p className="text-sm text-gray-600">{lot.hectares} ha</p>
                </div>
                <button
                  onClick={() => setSelectedLot(lot.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalle</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Registros Totales:</span>
                  <span className="text-sm font-medium">{lotRecords.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Crecimiento Promedio:</span>
                  <span className="text-sm font-medium">{summary.averageGrowth.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vacunas Aplicadas:</span>
                  <span className="text-sm font-medium">{summary.totalVaccines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Alimentos Registrados:</span>
                  <span className="text-sm font-medium">{summary.totalFood}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Progreso de Trazabilidad
                  </span>
                  <span className="text-sm text-gray-600">
                    {lotRecords.length} registros
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((lotRecords.length / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Traceability;