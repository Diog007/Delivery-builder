import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Admin, DashboardStats } from "@/types";
import { MockDataService } from "@/lib/mockData";

interface AdminContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  dashboardStats: DashboardStats | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshDashboard: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = admin !== null;

  // Check for existing session on mount
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
      refreshDashboard();
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const authenticatedAdmin = MockDataService.login(username, password);

    if (authenticatedAdmin) {
      setAdmin(authenticatedAdmin);
      localStorage.setItem("admin", JSON.stringify(authenticatedAdmin));
      refreshDashboard();
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setAdmin(null);
    setDashboardStats(null);
    localStorage.removeItem("admin");
  };

  const refreshDashboard = () => {
    const stats = MockDataService.getDashboardStats();
    setDashboardStats(stats);
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated,
        dashboardStats,
        isLoading,
        login,
        logout,
        refreshDashboard,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
