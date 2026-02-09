import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Medicine, Order, INITIAL_MEDICINES, MOCK_USER, MOCK_ADMIN, RefillAlert, OrderItem } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  medicineId: string;
  quantity: number;
}

interface AppContextType {
  user: User | null;
  medicines: Medicine[];
  cart: CartItem[];
  orders: Order[];
  alerts: RefillAlert[];
  isLoading: boolean;
  login: (email: string, role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  addToCart: (medicineId: string, quantity?: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
  placeOrder: () => Promise<void>;
  addMedicinesFromCSV: (data: any[]) => void;
  processAIMessage: (message: string) => Promise<{ text: string, action?: string }>;
  checkPrescription: (file: File) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<RefillAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Simulate Refill Prediction Agent on mount/login
  useEffect(() => {
    if (user && user.role === 'user') {
      // Mock alert generation logic
      const mockAlert: RefillAlert = {
        id: 'alert-1',
        userId: user.id,
        medicineId: '2',
        medicineName: 'Lisinopril 10mg',
        daysRemaining: 3,
        dismissed: false
      };
      setAlerts([mockAlert]);
    } else {
      setAlerts([]);
    }
  }, [user]);

  const login = async (email: string, role: 'user' | 'admin') => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (role === 'admin') {
      setUser(MOCK_ADMIN);
    } else {
      setUser(MOCK_USER);
    }
    setIsLoading(false);
    toast({
      title: "Welcome back",
      description: `Logged in as ${role === 'admin' ? 'Administrator' : 'User'}`,
    });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    toast({
      title: "Logged out",
      description: "See you next time.",
    });
  };

  const addToCart = (medicineId: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicineId === medicineId);
      if (existing) {
        return prev.map(item => 
          item.medicineId === medicineId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { medicineId, quantity }];
    });
    toast({
      title: "Added to cart",
      description: "Item added to your cart.",
    });
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicineId !== medicineId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async () => {
    if (!user) return;
    setIsLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newOrderItems: OrderItem[] = cart.map(item => {
      const med = medicines.find(m => m.id === item.medicineId);
      return {
        medicineId: item.medicineId,
        quantity: item.quantity,
        priceAtTime: med ? med.price : 0,
        medicineName: med ? med.name : 'Unknown'
      };
    });

    const total = newOrderItems.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: user.id,
      items: newOrderItems,
      total,
      status: 'pending',
      date: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Reduce stock
    setMedicines(prev => prev.map(med => {
      const cartItem = cart.find(c => c.medicineId === med.id);
      if (cartItem) {
        return { ...med, stock: med.stock - cartItem.quantity };
      }
      return med;
    }));

    setCart([]);
    setIsLoading(false);
    
    toast({
      title: "Order Placed Successfully",
      description: `Order #${newOrder.id} has been confirmed. Dispatching from warehouse...`,
      variant: "default",
    });
    
    console.log("Warehouse dispatch triggered via Mock Webhook");
  };

  const addMedicinesFromCSV = (data: any[]) => {
    // Basic mapping assuming CSV columns match or similar
    const newMeds: Medicine[] = data.map((row, index) => ({
      id: `csv-${Date.now()}-${index}`,
      name: row.name || row.Name || 'Unknown Medicine',
      description: row.description || row.Description || 'Imported medicine',
      price: parseFloat(row.price || row.Price || '0'),
      stock: parseInt(row.stock || row.Stock || '0'),
      category: row.category || row.Category || 'General',
      prescriptionRequired: (row.prescription || row.Prescription) === 'Yes',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200&h=200' // Placeholder
    }));
    
    setMedicines(prev => [...prev, ...newMeds]);
    toast({
      title: "Import Successful",
      description: `Added ${newMeds.length} medicines to inventory.`,
    });
  };

  const processAIMessage = async (message: string): Promise<{ text: string, action?: string }> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate Llama3 inference
    setIsLoading(false);

    const lowerMsg = message.toLowerCase();

    // Intent: Buy/Order
    if (lowerMsg.includes('buy') || lowerMsg.includes('order') || lowerMsg.includes('need')) {
      // Extract medicine name (naive approach)
      const foundMed = medicines.find(m => lowerMsg.includes(m.name.toLowerCase().split(' ')[0].toLowerCase()));
      
      if (foundMed) {
        addToCart(foundMed.id, 1);
        return { 
          text: `I've found ${foundMed.name} in our stock ($${foundMed.price}). I've added 1 pack to your cart. Do you need anything else?`,
          action: 'add_to_cart'
        };
      } else {
        return { text: "I couldn't find that specific medicine in our inventory. Could you check the spelling or browse our shop?" };
      }
    }

    // Intent: Refill
    if (lowerMsg.includes('refill')) {
       return { text: "I checked your history. It looks like your Lisinopril is due for a refill in 3 days. Would you like me to prepare that order?" };
    }

    // Intent: Check Stock/Info
    if (lowerMsg.includes('have') || lowerMsg.includes('stock') || lowerMsg.includes('list')) {
       return { text: "We have a wide range of medicines available, including Antibiotics, Pain Relief, and more. You can browse the full catalog on the Shop page." };
    }
    
    // Default
    return { text: "I'm MedAgent AI. I can help you order medicines, check for interactions, and manage your refills. How can I assist you today?" };
  };
  
  const checkPrescription = async (file: File): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate analysis
    // Mock validation - always valid for prototype unless file name contains "fail"
    if (file.name.toLowerCase().includes('fail')) {
       return false;
    }
    return true;
  };

  return (
    <AppContext.Provider value={{
      user,
      medicines,
      cart,
      orders,
      alerts,
      isLoading,
      login,
      logout,
      addToCart,
      removeFromCart,
      clearCart,
      placeOrder,
      addMedicinesFromCSV,
      processAIMessage,
      checkPrescription
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
