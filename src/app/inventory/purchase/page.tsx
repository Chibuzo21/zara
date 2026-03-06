"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import PurchaseForm from "./components/purchaseForm";
import { PurchaseFormValues } from "./types";

export default function PurchasePage() {
  const router = useRouter();
  const recordPurchase = useMutation(
    api.inventory.inventoryMutations.recordBulkPurchase,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PurchaseFormValues) => {
    if (data.items.length === 0) return;

    setIsLoading(true);
    try {
      await recordPurchase({
        purchaseDate: data.purchaseDate,
        notes: data.notes || undefined,
        items: data.items.map((item) => ({
          itemId: item.itemId as Id<"inventoryItems">,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.quantity * item.unitCost,
        })),
      });
      router.push("/inventory");
    } catch (error) {
      console.error("Error recording purchase:", error);
      alert("Failed to record purchase. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link
          href='/inventory'
          className='p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors'>
          <ArrowLeft size={20} strokeWidth={2} />
        </Link>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Record Purchase Order
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            Add multiple items to inventory at once
          </p>
        </div>
      </div>

      <PurchaseForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
