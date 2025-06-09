import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CreditCard, Banknote, Truck, Store } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { Customer, DeliveryAddress, Payment } from "@/types";

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrder, isLoading } = useOrders();

  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    whatsapp: "",
    cpf: "",
    birthDate: "",
    email: "",
  });
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    zipCode: "",
  });
  const [payment, setPayment] = useState<Payment>({
    method: "cash",
  });
  const [observations, setObservations] = useState("");

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice >= 40 ? 0 : 5;
  const finalTotal = totalPrice + deliveryFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const validateForm = () => {
    if (
      !customer.name ||
      !customer.whatsapp ||
      !customer.cpf ||
      !customer.email
    ) {
      return false;
    }

    if (deliveryType === "delivery") {
      if (
        !deliveryAddress.street ||
        !deliveryAddress.number ||
        !deliveryAddress.neighborhood ||
        !deliveryAddress.city ||
        !deliveryAddress.zipCode
      ) {
        return false;
      }
    }

    if (
      payment.method === "card" &&
      (!payment.cardBrand || !payment.cardType)
    ) {
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const orderData = {
        items: items.map((item) => ({ ...item })),
        customer,
        deliveryType,
        deliveryAddress:
          deliveryType === "delivery" ? deliveryAddress : undefined,
        payment,
        status: "received" as const,
        createdAt: new Date(),
        estimatedDeliveryTime: new Date(
          Date.now() + (deliveryType === "delivery" ? 45 : 30) * 60 * 1000,
        ),
        totalAmount: finalTotal,
        observations,
      };

      const order = await createOrder(orderData);
      clearCart();
      navigate(`/tracking/${order.id}`);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/cart")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Carrinho
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Finalizar Pedido
              </h1>
              <p className="text-gray-600">
                Preencha seus dados para confirmar o pedido
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Tipo de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryType}
                    onValueChange={(value) =>
                      setDeliveryType(value as "delivery" | "pickup")
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label
                        htmlFor="delivery"
                        className="flex items-center cursor-pointer"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Entrega em casa
                        {deliveryFee > 0 && (
                          <span className="ml-2 text-sm text-gray-600">
                            (+{formatPrice(deliveryFee)})
                          </span>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label
                        htmlFor="pickup"
                        className="flex items-center cursor-pointer"
                      >
                        <Store className="h-4 w-4 mr-2" />
                        Retirar no balcão (Grátis)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {deliveryType === "delivery" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">CEP *</Label>
                        <Input
                          id="zipCode"
                          placeholder="00000-000"
                          value={deliveryAddress.zipCode}
                          onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                              ...prev,
                              zipCode: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="street">Rua *</Label>
                        <Input
                          id="street"
                          placeholder="Nome da rua"
                          value={deliveryAddress.street}
                          onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                              ...prev,
                              street: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="number">Número *</Label>
                        <Input
                          id="number"
                          placeholder="123"
                          value={deliveryAddress.number}
                          onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                              ...prev,
                              number: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          placeholder="Apto, bloco, etc."
                          value={deliveryAddress.complement}
                          onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                              ...prev,
                              complement: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="neighborhood">Bairro *</Label>
                        <Input
                          id="neighborhood"
                          placeholder="Nome do bairro"
                          value={deliveryAddress.neighborhood}
                          onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                              ...prev,
                              neighborhood: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          placeholder="Nome da cidade"
                          value={deliveryAddress.city}
                          onChange={(e) =>
                            setDeliveryAddress((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="whatsapp">WhatsApp *</Label>
                      <Input
                        id="whatsapp"
                        placeholder="(11) 99999-9999"
                        value={customer.whatsapp}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            whatsapp: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={customer.cpf}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            cpf: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthDate">Data de Nascimento</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={customer.birthDate}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            birthDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={customer.email}
                        onChange={(e) =>
                          setCustomer((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={payment.method}
                    onValueChange={(value) =>
                      setPayment((prev) => ({
                        ...prev,
                        method: value as "cash" | "card",
                      }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label
                        htmlFor="cash"
                        className="flex items-center cursor-pointer"
                      >
                        <Banknote className="h-4 w-4 mr-2" />
                        Dinheiro
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center cursor-pointer"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Cartão
                      </Label>
                    </div>
                  </RadioGroup>

                  {payment.method === "card" && (
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="cardBrand">Bandeira do Cartão *</Label>
                        <Select
                          value={payment.cardBrand}
                          onValueChange={(value) =>
                            setPayment((prev) => ({
                              ...prev,
                              cardBrand: value as any,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a bandeira" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">Visa</SelectItem>
                            <SelectItem value="mastercard">
                              MasterCard
                            </SelectItem>
                            <SelectItem value="elo">Elo</SelectItem>
                            <SelectItem value="amex">
                              American Express
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cardType">Tipo de Cartão *</Label>
                        <Select
                          value={payment.cardType}
                          onValueChange={(value) =>
                            setPayment((prev) => ({
                              ...prev,
                              cardType: value as any,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit">Crédito</SelectItem>
                            <SelectItem value="debit">Débito</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Observations */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações (Opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Alguma observação adicional sobre o pedido..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {item.quantity}x {item.pizzaType.name}
                          </span>
                          <span>{formatPrice(item.totalPrice)}</span>
                        </div>
                        <div className="text-gray-600">
                          {item.flavor.name}
                          {item.extras.length > 0 && (
                            <span>
                              {" "}
                              + {item.extras.map((e) => e.name).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxa de entrega:</span>
                      <span>
                        {deliveryFee === 0
                          ? "Grátis"
                          : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-red-600">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Tempo estimado:</strong>
                    </p>
                    <p className="text-sm text-blue-700">
                      {deliveryType === "delivery"
                        ? "40-50 minutos"
                        : "25-35 minutos"}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleSubmitOrder}
                    disabled={!validateForm() || isLoading}
                  >
                    {isLoading ? "Processando..." : "Confirmar Pedido"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Ao confirmar, você concorda com nossos termos de serviço
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
