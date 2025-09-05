export interface User {
  id: string;
  name: string;
  email: string;
  role: 'producer';
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  area: number;
  producerId: string;
  isComplete: boolean;
}

export interface Lot {
  id: string;
  number: string;
  hectares: number;
  estimatedProduction: number;
  startDate: string;
  farmId: string;
  status: 'initiated' | 'in_progress' | 'completed' | 'finished';
}

export interface TraceabilityRecord {
  id: string;
  lotId: string;
  type: 'vaccine' | 'food' | 'water' | 'growth';
  date: string;
  name: string;
  quantity: number;
  unit: 'mg' | 'kg' | 'gr' | 'ml' | 'l' | 'cm';
  observations: string;
  status: 'initiated' | 'completed' | 'finished';
  // Campos adicionales para vacunas y alimentos
  expirationDate?: string;
  manufacturingYear?: string;
  qualityCertificate?: string;
  sanitaryRegistry?: string;
  manufacturer?: string;
  batchNumber?: string;
  // Campos adicionales para agua
  waterPh?: number;
  waterType?: 'potable' | 'well' | 'treated' | 'spring';
  waterSource?: string;
  chlorineLevel?: number;
  hardness?: number;
  temperature?: number;
  // Campos adicionales para crecimiento
  weight?: number;
  age?: number;
  feedConversion?: number;
  mortality?: number;
  healthStatus?: 'excellent' | 'good' | 'regular' | 'poor';
  environmentalTemp?: number;
  humidity?: number;
}

export interface TraceabilitySummary {
  averageGrowth: number;
  totalVaccines: number;
  totalFood: number;
  growthHistory: Array<{
    date: string;
    value: number;
  }>;
  vaccineHistory: Array<{
    date: string;
    name: string;
    quantity: number;
  }>;
  foodHistory: Array<{
    date: string;
    name: string;
    quantity: number;
  }>;
}

export interface Purchase {
  id: string;
  lotId: string;
  buyerName: string;
  buyerCompany: string;
  quantity: number; // kg
  pricePerKg: number; // USD
  totalAmount: number; // USD
  purchaseDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'paid';
  paymentMethod: 'cash' | 'transfer' | 'check';
}

export interface Actor {
  id: string;
  name: string;
  company: string;
  type: 'vaccine_supplier' | 'feed_supplier' | 'transporter' | 'veterinarian';
  contactInfo: string;
  interventionDate: string;
  cost: number; // USD
  description: string;
  lotId: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalCosts: number;
  roi: number;
  profitMargin: number;
  costBreakdown: {
    vaccines: number;
    feed: number;
    transport: number;
    veterinary: number;
    other: number;
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}