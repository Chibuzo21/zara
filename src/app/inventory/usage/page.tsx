"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UsageForm from "./components/usageForm";
import { UsageFormValues } from "./types";

export default function UsagePage() {
  const router = useRouter();
  const recordUsage = useMutation(api.inventory.inventoryMutations.recordUsage);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UsageFormValues) => {
    // Validate no item exceeds current stock
    const overStock = data.items.filter(
      (item) => item.quantity > item.currentStock,
    );
    if (overStock.length > 0) {
      alert(
        `Cannot use more than available stock for: ${overStock.map((i) => i.itemName).join(", ")}`,
      );
      return;
    }

    setIsLoading(true);
    try {
      await recordUsage({
        usageDate: data.usageDate,
        notes: data.notes || undefined,
        items: data.items.map((item) => ({
          itemId: item.itemId as Id<"inventoryItems">,
          quantity: item.quantity,
          reason: item.reason,
        })),
      });
      router.push("/inventory");
    } catch (error) {
      console.error("Error recording usage:", error);
      alert("Failed to record usage. Please try again.");
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
            Record Stock Usage
          </h1>
          <p className='text-sm text-gray-400 mt-0.5'>
            Track materials used in production
          </p>
        </div>
      </div>

      <UsageForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
