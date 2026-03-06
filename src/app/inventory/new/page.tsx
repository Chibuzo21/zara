"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InventoryFormValues } from "./types";
import NewForm from "./components/newForm";

export default function NewInventoryPage() {
  const router = useRouter();
  const createItem = useMutation(api.inventory.inventoryMutations.create);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: InventoryFormValues) => {
    setIsLoading(true);
    try {
      await createItem({
        itemName: data.itemName,
        category: data.category,
        unit: data.unit,
        reorderLevel: data.reorderLevel,
        currentStock: data.currentStock,
        unitCost: data.unitCost,
        supplierId: data.supplierId
          ? (data.supplierId as Id<"suppliers">)
          : undefined,
        status: "active",
      });
      router.push("/inventory");
    } catch (error) {
      console.error("Error creating inventory item:", error);
      alert("Failed to add inventory item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/inventory'
          className='p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Add Inventory Item
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            Add a new item to your inventory
          </p>
        </div>
      </div>

      <NewForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
