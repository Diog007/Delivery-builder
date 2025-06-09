import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Order, OrderStatus } from "@/types";
import { MockDataService } from "@/lib/mockData";

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  createOrder: (order: Omit<Order, "id">) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  setCurrentOrder: (order: Order | null) => void;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial orders
  useEffect(() => {
    refreshOrders();
  }, []);

  // Simulate real-time updates for order status
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshOrders = () => {
    const allOrders = MockDataService.getOrders();
    setOrders(allOrders);

    // Update current order if it exists
    if (currentOrder) {
      const updatedCurrentOrder = allOrders.find(
        (o) => o.id === currentOrder.id,
      );
      if (updatedCurrentOrder) {
        setCurrentOrder(updatedCurrentOrder);
      }
    }
  };

  const createOrder = async (orderData: Omit<Order, "id">): Promise<Order> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newOrder = MockDataService.addOrder(orderData);
    refreshOrders();
    setCurrentOrder(newOrder);
    setIsLoading(false);

    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    MockDataService.updateOrderStatus(id, status);
    refreshOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        isLoading,
        createOrder,
        getOrderById,
        updateOrderStatus,
        setCurrentOrder,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
