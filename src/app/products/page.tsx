"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Id } from "../../../convex/_generated/dataModel";
import type { Product } from "./types";
import { productSchema, type ProductFormValues } from "./validation";
import SummaryCard from "./Components/Summary-Card";
import Filters from "./Components/Filters";
import ProductsTable from "./Components/productsTable";
import ProductForm from "./Components/ProductsForm";
import { Resolver } from "react-hook-form";
export default function ProductsPage() {
  const products = useQuery(api.production.products.getAll);
  const createProduct = useMutation(api.production.productsMutations.create);
  const updateProduct = useMutation(api.production.productsMutations.update);
  const removeProduct = useMutation(api.production.productsMutations.remove);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      productName: "",
      category: "Bread",
      basePrice: 0,
      productionCost: undefined,
      status: "active",
    },
  });

  if (products === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const activeCount = products.filter((p) => p.status === "active").length;
  const totalValue = products.reduce((sum, p) => sum + p.basePrice, 0);
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    reset({
      productName: product.productName,
      category: product.category,
      basePrice: product.basePrice,
      productionCost: product.productionCost ?? undefined,
      status: product.status,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: Id<"products">) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await removeProduct({ id });
    } catch {
      alert("Failed to delete product");
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (editingId) {
        await updateProduct({ id: editingId, ...data });
      } else {
        await createProduct(data);
      }
      handleCancel();
    } catch {
      alert("Failed to save product");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Products Management
          </h1>
          <p className='text-gray-600 mt-1'>
            Manage bakery products and pricing
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className='btn-primary'>
          <Plus size={20} className='inline mr-2' />
          Add Product
        </button>
      </div>

      <SummaryCard
        products={products}
        categories={categories}
        activeCount={activeCount}
        avgPrice={avgPrice}
      />

      {showForm && (
        <ProductForm
          register={register}
          handleSubmit={handleSubmit(onSubmit)}
          errors={errors}
          isSubmitting={isSubmitting}
          isEditing={!!editingId}
          onCancel={handleCancel}
          watch={watch}
        />
      )}

      <Filters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categories={categories}
      />

      <ProductsTable
        filteredProducts={filteredProducts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}
