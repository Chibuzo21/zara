import {
  AlertTriangle,
  Settings,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { TransactionType } from "./types";

export const TYPE_CONFIG: Record<
  TransactionType,
  {
    label: string;
    icon: React.ElementType;
    badge: string;
    qty: "positive" | "negative";
  }
> = {
  purchase: {
    label: "Purchase",
    icon: TrendingUp,
    badge: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    qty: "positive",
  },
  usage: {
    label: "Usage",
    icon: TrendingDown,
    badge: "bg-amber-50 text-amber-600 border border-amber-100",
    qty: "negative",
  },
  waste: {
    label: "Waste",
    icon: AlertTriangle,
    badge: "bg-red-50 text-red-500 border border-red-100",
    qty: "negative",
  },
  adjustment: {
    label: "Adjustment",
    icon: Settings,
    badge: "bg-blue-50 text-blue-600 border border-blue-100",
    qty: "positive",
  },
};
