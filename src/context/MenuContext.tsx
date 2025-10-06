import React, { createContext, useState, useContext, ReactNode } from 'react';

// Types
export type Course = 'Starters' | 'Mains' | 'Dessert';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
  recommended?: boolean;
}

export interface MenuSnapshot {
  id: string;
  name: string;
  menu: MenuItem[];
  createdAt: Date;
}

export interface ChefAvailability {
  isAvailable: boolean;
  availableFrom: string;
  availableUntil: string;
  bookingCost: number;
  specialities: string[];
  notes: string;
}

interface MenuContextType {
  menu: MenuItem[];
  savedMenus: MenuSnapshot[];
  isSaved: boolean;
  chefAvailability: ChefAvailability;
  addDish: (dish: Omit<MenuItem, 'id'>) => void;
  updateDish: (id: string, dish: Omit<MenuItem, 'id'>) => void;
  removeDish: (id: string) => void;
  saveCurrentMenu: (name: string) => void;
  loadSnapshot: (id: string) => void;
  suggestMenu: () => {
    starter?: MenuItem;
    main?: MenuItem;
    dessert?: MenuItem;
  };
  updateChefAvailability: (availability: Partial<ChefAvailability>) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Generate unique ID
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Provider component
export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [savedMenus, setSavedMenus] = useState<MenuSnapshot[]>([]);
  const [isSaved, setIsSaved] = useState(true);
  
  const [chefAvailability, setChefAvailability] = useState<ChefAvailability>({
    isAvailable: true,
    availableFrom: "18:00",
    availableUntil: "22:00",
    bookingCost: 500,
    specialities: ["Italian Cuisine", "Grilled Dishes", "Desserts"],
    notes: "Prices may vary based on ingredient availability and market costs. Advanced booking required."
  });

  const addDish = (dish: Omit<MenuItem, 'id'>) => {
    const newDish: MenuItem = { ...dish, id: generateId() };
    setMenu(prev => [...prev, newDish]);
    setIsSaved(false);
  };

  const updateDish = (id: string, dish: Omit<MenuItem, 'id'>) => {
    setMenu(prev => prev.map(item => item.id === id ? { ...dish, id } : item));
    setIsSaved(false);
  };

  const removeDish = (id: string) => {
    setMenu(prev => prev.filter(item => item.id !== id));
    setIsSaved(false);
  };

  const saveCurrentMenu = (name: string) => {
    const snapshot: MenuSnapshot = {
      id: generateId(),
      name,
      menu: [...menu],
      createdAt: new Date(),
    };
    setSavedMenus(prev => [...prev, snapshot]);
    setIsSaved(true);
  };

  const loadSnapshot = (id: string) => {
    const snapshot = savedMenus.find(s => s.id === id);
    if (snapshot) {
      setMenu([...snapshot.menu]);
      setIsSaved(true);
    }
  };

  const suggestMenu = () => {
    const starters = menu.filter(item => item.course === 'Starters');
    const mains = menu.filter(item => item.course === 'Mains');
    const desserts = menu.filter(item => item.course === 'Dessert');

    return {
      starter: starters.length > 0 ? starters[Math.floor(Math.random() * starters.length)] : undefined,
      main: mains.length > 0 ? mains[Math.floor(Math.random() * mains.length)] : undefined,
      dessert: desserts.length > 0 ? desserts[Math.floor(Math.random() * desserts.length)] : undefined,
    };
  };

  const updateChefAvailability = (availability: Partial<ChefAvailability>) => {
    setChefAvailability(prev => ({ ...prev, ...availability }));
  };

  return (
    <MenuContext.Provider value={{
      menu,
      savedMenus,
      isSaved,
      chefAvailability,
      addDish,
      updateDish,
      removeDish,
      saveCurrentMenu,
      loadSnapshot,
      suggestMenu,
      updateChefAvailability,
    }}>
      {children}
    </MenuContext.Provider>
  );
};

// Hook to use the context
export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};