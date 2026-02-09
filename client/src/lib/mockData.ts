
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: string;
  phone?: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  prescriptionRequired: boolean;
  image?: string;
}

export interface OrderItem {
  medicineId: string;
  quantity: number;
  priceAtTime: number;
  medicineName: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface RefillAlert {
  id: string;
  userId: string;
  medicineId: string;
  medicineName: string;
  daysRemaining: number;
  dismissed: boolean;
}

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Amoxicillin 500mg',
    description: 'Antibiotic used to treat bacterial infections.',
    price: 12.99,
    stock: 50,
    category: 'Antibiotics',
    prescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1471864190276-a9468756af52?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '2',
    name: 'Lisinopril 10mg',
    description: 'Medication used to treat high blood pressure.',
    price: 8.50,
    stock: 120,
    category: 'Cardiovascular',
    prescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '3',
    name: 'Ibuprofen 200mg',
    description: 'Non-steroidal anti-inflammatory drug (NSAID).',
    price: 5.99,
    stock: 500,
    category: 'Pain Relief',
    prescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '4',
    name: 'Metformin 500mg',
    description: 'First-line medication for the treatment of type 2 diabetes.',
    price: 10.00,
    stock: 85,
    category: 'Diabetes',
    prescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '5',
    name: 'Cetirizine 10mg',
    description: 'Antihistamine used to relieve allergy symptoms.',
    price: 15.49,
    stock: 200,
    category: 'Allergy',
    prescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1555633514-abcea617af9c?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '6',
    name: 'Atorvastatin 20mg',
    description: 'Statin medication used to prevent cardiovascular disease.',
    price: 18.25,
    stock: 60,
    category: 'Cardiovascular',
    prescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Dr. Admin',
  email: 'admin@medagent.ai',
  role: 'admin'
};

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Patient',
  email: 'alex@example.com',
  role: 'user',
  address: '123 Health St, Wellness City',
  phone: '555-0123'
};
