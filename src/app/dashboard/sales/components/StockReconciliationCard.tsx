import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  Package,
  Plus,
  Trash2,
  ClipboardList,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "../../../../../lib/utils";
import { Sale } from "../types";

interface StockReconciliationCardProps {
  todaySales: Sale[];
  staffId: Id<"staff"> | undefined;
  recordedBy: Id<"users">;
  today: string;
  onSubmitSuccess?: () => void; // called after successful submit so parent can advance the step
}

type StockRow = {
  localId: string;
  productId: string;
  openingQty: number;
  damagedQty: number;
};

export default function StockReconciliationCard({
  todaySales,
  staffId,
  recordedBy,
  today,
  onSubmitSuccess,
}: StockReconciliationCardProps) {
  const products = (useQuery(api.production.products.getActive) ?? []) as any[];
  const submitDailyStock = useMutation(
    api.stock.stockMutations.submitDailyStock,
  );

  const [rows, setRows] = useState<StockRow[]>([
    {
      localId: crypto.randomUUID(),
      productId: "",
      openingQty: 0,
      damagedQty: 0,
    },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Sold-per-product map from today's real sales ─────────────────────────
  const soldMap = useMemo(() => {
    const m: Record<string, number> = {};
    todaySales.forEach((s) => {
      m[s.productId] = (m[s.productId] ?? 0) + s.quantitySold;
    });
    return m;
  }, [todaySales]);

  // ─── Compute reconciliation per row ──────────────────────────────────────
  const computed = rows.map((row) => {
    const product = products.find((p) => p._id === row.productId);
    const sold = soldMap[row.productId] ?? 0;
    const expectedRemaining = row.openingQty - sold - row.damagedQty;

    const nonCreditSales = todaySales.filter(
      (s) => s.productId === row.productId && s.paymentMethod !== "credit",
    );
    const creditAmount = todaySales
      .filter(
        (s) => s.productId === row.productId && s.paymentMethod === "credit",
      )
      .reduce((acc, s) => acc + s.totalAmount, 0);

    const actualCollected = nonCreditSales.reduce(
      (acc, s) => acc + s.totalAmount,
      0,
    );
    const expectedRevenue = sold * (product?.basePrice ?? 0) - creditAmount;
    const cashVariance = actualCollected - expectedRevenue;

    const qtyAlert = expectedRemaining < 0;
    const cashAlert = cashVariance < -1 && nonCreditSales.length > 0;

    return {
      ...row,
      product,
      sold,
      expectedRemaining,
      expectedRevenue,
      actualCollected,
      cashVariance,
      qtyAlert,
      cashAlert,
    };
  });

  const hasAlert = computed.some((r) => r.qtyAlert || r.cashAlert);

  // ─── Row helpers ──────────────────────────────────────────────────────────
  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        localId: crypto.randomUUID(),
        productId: "",
        openingQty: 0,
        damagedQty: 0,
      },
    ]);

  const removeRow = (localId: string) =>
    setRows((prev) => prev.filter((r) => r.localId !== localId));

  const updateRow = (localId: string, field: keyof StockRow, value: any) =>
    setRows((prev) =>
      prev.map((r) => (r.localId === localId ? { ...r, [field]: value } : r)),
    );

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!staffId) return;
    const validRows = rows.filter((r) => r.productId !== "");
    if (validRows.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitDailyStock({
        staffId,
        recordedBy,
        entryDate: today,
        entries: validRows.map((r) => {
          const prod = products.find((p) => p._id === r.productId);
          return {
            productId: r.productId as Id<"products">,
            productName: prod?.productName,
            openingQty: r.openingQty,
            damagedQty: r.damagedQty,
          };
        }),
      });
      setSubmitted(true);
      onSubmitSuccess?.();
    } catch (err) {
      console.error("Failed to submit stock report:", err);
      alert("Failed to submit stock report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusFor = (qtyAlert: boolean, cashAlert: boolean) => {
    if (qtyAlert && cashAlert)
      return {
        label: "Both Flagged",
        cls: "bg-red-50 text-red-600 border border-red-100",
      };
    if (qtyAlert)
      return {
        label: "Qty Missing",
        cls: "bg-red-50 text-red-600 border border-red-100",
      };
    if (cashAlert)
      return {
        label: "Cash Short",
        cls: "bg-orange-50 text-orange-600 border border-orange-100",
      };
    return {
      label: "Clear",
      cls: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    };
  };

  if (submitted) {
    return (
      <div className='flex items-center gap-3 px-4 py-3 bg-white border border-emerald-100 rounded-xl'>
        <CheckCircle2
          size={18}
          className='text-emerald-500 flex-shrink-0'
          strokeWidth={2}
        />
        <div>
          <p className='text-sm font-semibold text-gray-800'>
            Stock report submitted
          </p>
          <p className='text-xs text-gray-400 mt-0.5'>
            {hasAlert
              ? "Discrepancies flagged for admin review."
              : "No discrepancies. All clear."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Table */}
      <div className='overflow-x-auto -mx-5 px-5'>
        <table className='w-full text-sm min-w-[640px]'>
          <thead>
            <tr className='border-b border-gray-50'>
              {[
                "Product",
                "Opening Stock",
                "Damaged / Write-Off",
                "Sold Today",
                "Expected Remaining",
                "Expected Revenue",
                "Actual Collected",
                "Cash Variance",
                "Status",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className='px-3 py-2.5 text-left text-[10px] font-semibold tracking-widest uppercase text-gray-300 whitespace-nowrap'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-50'>
            {computed.map((row) => {
              const status = statusFor(row.qtyAlert, row.cashAlert);
              return (
                <tr
                  key={row.localId}
                  className='group hover:bg-amber-50/30 transition-colors'>
                  <td className='px-3 py-2.5'>
                    <select
                      value={row.productId}
                      onChange={(e) =>
                        updateRow(row.localId, "productId", e.target.value)
                      }
                      className='w-40 px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition'>
                      <option value=''>Select…</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.productName}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className='px-3 py-2.5'>
                    <input
                      type='number'
                      min='0'
                      value={row.openingQty}
                      onChange={(e) =>
                        updateRow(
                          row.localId,
                          "openingQty",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className='w-18 px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition'
                    />
                  </td>

                  <td className='px-3 py-2.5'>
                    <input
                      type='number'
                      min='0'
                      value={row.damagedQty}
                      onChange={(e) =>
                        updateRow(
                          row.localId,
                          "damagedQty",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className='w-18 px-2.5 py-2 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300 transition'
                    />
                    {row.damagedQty > 0 && (
                      <p className='text-[10px] text-amber-500 mt-0.5'>
                        write-off
                      </p>
                    )}
                  </td>

                  <td className='px-3 py-2.5 text-center font-semibold text-rose-500 tabular-nums'>
                    {row.sold}
                    {todaySales.some(
                      (s) =>
                        s.productId === row.productId &&
                        s.paymentMethod === "credit",
                    ) && (
                      <p className='text-[10px] text-orange-400 font-normal'>
                        incl. credit
                      </p>
                    )}
                  </td>

                  <td
                    className={`px-3 py-2.5 font-bold tabular-nums ${
                      row.qtyAlert ? "text-red-500" : "text-emerald-600"
                    }`}>
                    {row.expectedRemaining}
                    {row.qtyAlert && (
                      <p className='text-[10px] font-semibold text-red-400'>
                        {Math.abs(row.expectedRemaining)} missing
                      </p>
                    )}
                  </td>

                  <td className='px-3 py-2.5 text-xs text-gray-400 tabular-nums'>
                    {formatCurrency(row.expectedRevenue)}
                  </td>

                  <td className='px-3 py-2.5 font-semibold text-gray-700 tabular-nums'>
                    {formatCurrency(row.actualCollected)}
                  </td>

                  <td
                    className={`px-3 py-2.5 font-bold tabular-nums ${
                      row.cashVariance < 0
                        ? "text-red-500"
                        : row.cashVariance > 0
                          ? "text-emerald-600"
                          : "text-gray-400"
                    }`}>
                    {row.cashVariance >= 0 ? "+" : ""}
                    {formatCurrency(row.cashVariance)}
                  </td>

                  <td className='px-3 py-2.5'>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase ${status.cls}`}>
                      {status.label}
                    </span>
                  </td>

                  <td className='px-2 py-2.5'>
                    {rows.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeRow(row.localId)}
                        className='text-gray-200 hover:text-red-400 transition-colors'>
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Discrepancy banner */}
      {hasAlert && (
        <div className='flex gap-3 items-start px-4 py-3 rounded-xl bg-red-50 border border-red-100'>
          <ShieldAlert
            size={15}
            className='text-red-500 flex-shrink-0 mt-0.5'
            strokeWidth={2}
          />
          <div>
            <p className='text-sm font-semibold text-red-700'>
              Flagged for Admin Review
            </p>
            <div className='mt-1 space-y-1'>
              {computed
                .filter((r) => r.qtyAlert)
                .map((r) => (
                  <p key={`q-${r.localId}`} className='text-xs text-red-600'>
                    📦 <strong>{r.product?.productName ?? "Unknown"}</strong> —{" "}
                    {Math.abs(r.expectedRemaining)} unit
                    {Math.abs(r.expectedRemaining) !== 1 ? "s" : ""} unaccounted
                    for
                  </p>
                ))}
              {computed
                .filter((r) => r.cashAlert)
                .map((r) => (
                  <p key={`c-${r.localId}`} className='text-xs text-orange-600'>
                    💸 <strong>{r.product?.productName ?? "Unknown"}</strong> —{" "}
                    {formatCurrency(Math.abs(r.cashVariance))} cash shortfall
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className='flex items-center justify-between'>
        <button
          type='button'
          onClick={addRow}
          className='inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-600 border border-amber-200 bg-white hover:bg-amber-50 transition-colors'>
          <Plus size={12} strokeWidth={2.5} />
          Add Product
        </button>

        <button
          type='button'
          onClick={handleSubmit}
          disabled={isSubmitting}
          className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'>
          {isSubmitting ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
              Submitting…
            </>
          ) : (
            <>
              <ClipboardList size={14} strokeWidth={2} />
              Submit Stock Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}
