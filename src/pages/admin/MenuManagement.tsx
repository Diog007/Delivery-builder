import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Pizza, Package, Star } from "lucide-react";
import { PizzaType, PizzaFlavor, PizzaExtra } from "@/types";
import { MockDataService } from "@/lib/mockData";

export const MenuManagement = () => {
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [pizzaFlavors, setPizzaFlavors] = useState<PizzaFlavor[]>([]);
  const [pizzaExtras, setPizzaExtras] = useState<PizzaExtra[]>([]);

  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isFlavorDialogOpen, setIsFlavorDialogOpen] = useState(false);
  const [isExtraDialogOpen, setIsExtraDialogOpen] = useState(false);

  const [editingType, setEditingType] = useState<PizzaType | null>(null);
  const [editingFlavor, setEditingFlavor] = useState<PizzaFlavor | null>(null);
  const [editingExtra, setEditingExtra] = useState<PizzaExtra | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPizzaTypes(MockDataService.getPizzaTypes());
    setPizzaFlavors(MockDataService.getPizzaFlavors());
    setPizzaExtras(MockDataService.getPizzaExtras());
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Pizza Type Management
  const TypeDialog = () => {
    const [formData, setFormData] = useState({
      name: editingType?.name || "",
      description: editingType?.description || "",
      basePrice: editingType?.basePrice || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (editingType) {
        MockDataService.updatePizzaType(editingType.id, formData);
      } else {
        MockDataService.addPizzaType(formData);
      }

      loadData();
      setIsTypeDialogOpen(false);
      setEditingType(null);
    };

    return (
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Editar Tipo de Pizza" : "Novo Tipo de Pizza"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="basePrice">Preço Base (R$)</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTypeDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                {editingType ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Pizza Flavor Management
  const FlavorDialog = () => {
    const [formData, setFormData] = useState({
      name: editingFlavor?.name || "",
      description: editingFlavor?.description || "",
      typeId: editingFlavor?.typeId || "",
      price: editingFlavor?.price || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (editingFlavor) {
        MockDataService.updatePizzaFlavor(editingFlavor.id, formData);
      } else {
        MockDataService.addPizzaFlavor(formData);
      }

      loadData();
      setIsFlavorDialogOpen(false);
      setEditingFlavor(null);
    };

    return (
      <Dialog open={isFlavorDialogOpen} onOpenChange={setIsFlavorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFlavor ? "Editar Sabor" : "Novo Sabor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="flavorName">Nome do Sabor</Label>
              <Input
                id="flavorName"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="flavorDescription">Descrição</Label>
              <Textarea
                id="flavorDescription"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="typeId">Tipo de Pizza</Label>
              <Select
                value={formData.typeId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, typeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {pizzaTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="flavorPrice">Preço Adicional (R$)</Label>
              <Input
                id="flavorPrice"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFlavorDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                {editingFlavor ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Pizza Extra Management
  const ExtraDialog = () => {
    const [formData, setFormData] = useState({
      name: editingExtra?.name || "",
      description: editingExtra?.description || "",
      price: editingExtra?.price || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (editingExtra) {
        MockDataService.updatePizzaExtra(editingExtra.id, formData);
      } else {
        MockDataService.addPizzaExtra(formData);
      }

      loadData();
      setIsExtraDialogOpen(false);
      setEditingExtra(null);
    };

    return (
      <Dialog open={isExtraDialogOpen} onOpenChange={setIsExtraDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingExtra ? "Editar Adicional" : "Novo Adicional"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="extraName">Nome do Adicional</Label>
              <Input
                id="extraName"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="extraDescription">Descrição</Label>
              <Textarea
                id="extraDescription"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="extraPrice">Preço (R$)</Label>
              <Input
                id="extraPrice"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExtraDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                {editingExtra ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const handleDeleteType = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este tipo de pizza?")) {
      MockDataService.deletePizzaType(id);
      loadData();
    }
  };

  const handleDeleteFlavor = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este sabor?")) {
      MockDataService.deletePizzaFlavor(id);
      loadData();
    }
  };

  const handleDeleteExtra = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este adicional?")) {
      MockDataService.deletePizzaExtra(id);
      loadData();
    }
  };

  const getTypeName = (typeId: string) => {
    const type = pizzaTypes.find((t) => t.id === typeId);
    return type?.name || "Tipo não encontrado";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gerenciar Cardápio
          </h1>
          <p className="text-gray-600">
            Gerencie tipos de pizza, sabores e adicionais
          </p>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="types" className="space-y-4">
          <TabsList>
            <TabsTrigger value="types" className="flex items-center space-x-2">
              <Pizza className="h-4 w-4" />
              <span>Tipos de Pizza</span>
            </TabsTrigger>
            <TabsTrigger
              value="flavors"
              className="flex items-center space-x-2"
            >
              <Star className="h-4 w-4" />
              <span>Sabores</span>
            </TabsTrigger>
            <TabsTrigger value="extras" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Adicionais</span>
            </TabsTrigger>
          </TabsList>

          {/* Pizza Types Tab */}
          <TabsContent value="types">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Tipos de Pizza</CardTitle>
                  <Button
                    onClick={() => {
                      setEditingType(null);
                      setIsTypeDialogOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Tipo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {pizzaTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{type.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {type.description}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          Preço base: {formatPrice(type.basePrice)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingType(type);
                            setIsTypeDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteType(type.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pizza Flavors Tab */}
          <TabsContent value="flavors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Sabores</CardTitle>
                  <Button
                    onClick={() => {
                      setEditingFlavor(null);
                      setIsFlavorDialogOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Sabor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {pizzaFlavors.map((flavor) => (
                    <div
                      key={flavor.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{flavor.name}</h3>
                          <Badge variant="outline">
                            {getTypeName(flavor.typeId)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {flavor.description}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {flavor.price === 0
                            ? "Incluso"
                            : `+${formatPrice(flavor.price)}`}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingFlavor(flavor);
                            setIsFlavorDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFlavor(flavor.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pizza Extras Tab */}
          <TabsContent value="extras">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Adicionais</CardTitle>
                  <Button
                    onClick={() => {
                      setEditingExtra(null);
                      setIsExtraDialogOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Adicional
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {pizzaExtras.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{extra.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {extra.description}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {formatPrice(extra.price)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingExtra(extra);
                            setIsExtraDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteExtra(extra.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <TypeDialog />
        <FlavorDialog />
        <ExtraDialog />
      </div>
    </AdminLayout>
  );
};
