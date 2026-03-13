// "use client";
// import { useState, useMemo } from "react";
// import {
//   ShoppingCart,
//   Package,
//   AlertTriangle,
//   CheckCircle2,
//   Plus,
//   Trash2,
//   Wallet,
//   UserCheck,
//   ShieldAlert,
//   ClipboardList,
//   X,
// } from "lucide-react";

// // ─── MOCK DATA (replace with Convex useQuery hooks) ───────────────────────────

// const MOCK_PRODUCTS = [
//   { _id: "p1", productName: "Butter Croissant", basePrice: 3500 },
//   { _id: "p2", productName: "Sourdough Loaf", basePrice: 4200 },
//   { _id: "p3", productName: "Cinnamon Roll ×6", basePrice: 6500 },
//   { _id: "p4", productName: "Pain au Chocolat", basePrice: 4000 },
//   { _id: "p5", productName: "Baguette", basePrice: 2800 },
// ];

// const MOCK_SALES = [
//   {
//     _id: "s1",
//     _creationTime: Date.now() - 3600000,
//     productId: "p1",
//     product: { productName: "Butter Croissant" },
//     quantitySold: 18,
//     unitPrice: 3500,
//     totalAmount: 63000,
//     paymentMethod: "cash",
//     saleType: "shop",
//     customerName: "Adaeze Obi",
//   },
//   {
//     _id: "s2",
//     _creationTime: Date.now() - 7200000,
//     productId: "p2",
//     product: { productName: "Sourdough Loaf" },
//     quantitySold: 8,
//     unitPrice: 4200,
//     totalAmount: 29400,
//     paymentMethod: "transfer",
//     saleType: "shop",
//     customerName: null,
//   },
//   {
//     _id: "s3",
//     _creationTime: Date.now() - 10800000,
//     productId: "p3",
//     product: { productName: "Cinnamon Roll ×6" },
//     quantitySold: 5,
//     unitPrice: 6500,
//     totalAmount: 32500,
//     paymentMethod: "credit",
//     saleType: "transport",
//     customerName: "Emeka Ltd",
//   },
//   {
//     _id: "s4",
//     _creationTime: Date.now() - 14400000,
//     productId: "p4",
//     product: { productName: "Pain au Chocolat" },
//     quantitySold: 10,
//     unitPrice: 4000,
//     totalAmount: 40000,
//     paymentMethod: "pos",
//     saleType: "shop",
//     customerName: null,
//   },
// ];

// // ─── UTILS ────────────────────────────────────────────────────────────────────

// const fmt = (n) => `₦${Number(n || 0).toLocaleString("en-NG")}`;
// const todayLabel = new Date().toLocaleDateString("en-US", {
//   weekday: "long",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// });

// const PAYMENT_BADGE = {
//   cash: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", label: "Cash" },
//   transfer: {
//     bg: "#eff6ff",
//     color: "#2563eb",
//     border: "#bfdbfe",
//     label: "Transfer",
//   },
//   pos: { bg: "#f5f3ff", color: "#6d28d9", border: "#c4b5fd", label: "POS" },
//   credit: {
//     bg: "#fff7ed",
//     color: "#c2410c",
//     border: "#fed7aa",
//     label: "Credit",
//   },
// };

// // ─── COLLAPSIBLE SECTION ──────────────────────────────────────────────────────

// function Section({
//   title,
//   icon: Icon,
//   accent = "#fda4af",
//   borderColor = "#fce7e7",
//   children,
//   badge,
//   defaultOpen = true,
// }) {
//   const [open, setOpen] = useState(defaultOpen);
//   return (
//     <div
//       style={{
//         borderRadius: 18,
//         border: `1.5px solid ${borderColor}`,
//         background: "#fff",
//         overflow: "hidden",
//         boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
//       }}>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         style={{
//           width: "100%",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "15px 20px",
//           background: "#fffafa",
//           border: "none",
//           cursor: "pointer",
//           borderBottom: open ? `1px solid ${borderColor}` : "none",
//         }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <Icon size={14} style={{ color: accent }} strokeWidth={2.5} />
//           <span
//             style={{
//               fontSize: 10,
//               fontWeight: 700,
//               letterSpacing: "0.12em",
//               textTransform: "uppercase",
//               color: accent,
//             }}>
//             {title}
//           </span>
//           {badge && (
//             <span
//               style={{
//                 fontSize: 10,
//                 fontWeight: 700,
//                 padding: "2px 9px",
//                 borderRadius: 20,
//                 background: badge.bg,
//                 color: badge.color,
//               }}>
//               {badge.label}
//             </span>
//           )}
//         </div>
//         <span style={{ fontSize: 16, color: "#d1d5db", lineHeight: 1 }}>
//           {open ? "▲" : "▼"}
//         </span>
//       </button>
//       {open && <div style={{ padding: 20 }}>{children}</div>}
//     </div>
//   );
// }

// // ─── 1. KPI CARDS ─────────────────────────────────────────────────────────────

// function KpiCards({ sales }) {
//   const rate = 0.03;
//   const totalRevenue = sales.reduce((a, s) => a + s.totalAmount, 0);
//   const cashTotal = sales
//     .filter((s) => s.paymentMethod === "cash")
//     .reduce((a, s) => a + s.totalAmount, 0);
//   const creditTotal = sales
//     .filter((s) => s.paymentMethod === "credit")
//     .reduce((a, s) => a + s.totalAmount, 0);
//   const todayComm =
//     sales
//       .filter((s) => s.paymentMethod !== "credit")
//       .reduce((a, s) => a + s.totalAmount, 0) * rate;

//   const cards = [
//     {
//       label: "Today's Revenue",
//       value: fmt(totalRevenue),
//       sub: `${sales.length} transactions`,
//       grad: "linear-gradient(135deg,#f43f5e,#e11d48)",
//       shadow: "rgba(244,63,94,0.25)",
//     },
//     {
//       label: "Cash Sales",
//       value: fmt(cashTotal),
//       sub: "Cash collected",
//       grad: "linear-gradient(135deg,#10b981,#059669)",
//       shadow: "rgba(16,185,129,0.2)",
//     },
//     {
//       label: "Today's Commission",
//       value: fmt(todayComm),
//       sub: "3% on non-credit",
//       grad: null,
//       shadow: null,
//     },
//     {
//       label: "Credit Extended",
//       value: fmt(creditTotal),
//       sub: "Awaiting payment",
//       grad: "linear-gradient(135deg,#f97316,#ea580c)",
//       shadow: "rgba(249,115,22,0.2)",
//     },
//   ];

//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(4,1fr)",
//         gap: 14,
//       }}>
//       {cards.map(({ label, value, sub, grad, shadow }) => (
//         <div
//           key={label}
//           style={{
//             borderRadius: 18,
//             padding: 20,
//             background: grad || "#fff",
//             border: grad ? "none" : "1.5px solid #fce7e7",
//             boxShadow: shadow
//               ? `0 8px 24px ${shadow}`
//               : "0 2px 12px rgba(0,0,0,0.04)",
//             display: "flex",
//             flexDirection: "column",
//             gap: 10,
//             position: "relative",
//             overflow: "hidden",
//           }}>
//           <div
//             style={{
//               position: "absolute",
//               right: -18,
//               top: -18,
//               width: 72,
//               height: 72,
//               borderRadius: "50%",
//               background: grad
//                 ? "rgba(255,255,255,0.12)"
//                 : "rgba(244,63,94,0.04)",
//             }}
//           />
//           <span
//             style={{
//               fontSize: 10,
//               fontWeight: 700,
//               letterSpacing: "0.12em",
//               textTransform: "uppercase",
//               color: grad ? "rgba(255,255,255,0.7)" : "#9ca3af",
//             }}>
//             {label}
//           </span>
//           <p
//             style={{
//               fontSize: 24,
//               fontWeight: 800,
//               letterSpacing: "-0.03em",
//               color: grad ? "#fff" : "#111827",
//               lineHeight: 1,
//               fontFamily: "Georgia,serif",
//             }}>
//             {value}
//           </p>
//           <p
//             style={{
//               fontSize: 12,
//               color: grad ? "rgba(255,255,255,0.6)" : "#9ca3af",
//             }}>
//             {sub}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── 2. DAILY STOCK RECONCILIATION ───────────────────────────────────────────

// function StockReconciliation({ sales }) {
//   const [rows, setRows] = useState([
//     { id: 1, productId: "p1", openingQty: 40, damagedQty: 2 },
//     { id: 2, productId: "p2", openingQty: 20, damagedQty: 0 },
//     { id: 3, productId: "p3", openingQty: 15, damagedQty: 1 },
//     { id: 4, productId: "p4", openingQty: 25, damagedQty: 0 },
//   ]);
//   const [locked, setLocked] = useState(false);

//   const soldMap = useMemo(() => {
//     const m = {};
//     sales.forEach((s) => {
//       m[s.productId] = (m[s.productId] || 0) + s.quantitySold;
//     });
//     return m;
//   }, [sales]);

//   const computed = rows.map((row) => {
//     const product = MOCK_PRODUCTS.find((p) => p._id === row.productId);
//     const sold = soldMap[row.productId] || 0;
//     const expectedRemaining = row.openingQty - sold - row.damagedQty;
//     const expectedRevenue = sold * (product?.basePrice || 0);
//     // Only count non-credit cash for shortfall check
//     const actualCollected = sales
//       .filter(
//         (s) => s.productId === row.productId && s.paymentMethod !== "credit",
//       )
//       .reduce((a, s) => a + s.totalAmount, 0);
//     const cashVariance = actualCollected - expectedRevenue;
//     // Credit sales are expected to be unpaid — don't flag those as cash short
//     const hasCreditSales = sales.some(
//       (s) => s.productId === row.productId && s.paymentMethod === "credit",
//     );
//     const qtyAlert = expectedRemaining < 0;
//     const cashAlert = cashVariance < 0 && actualCollected > 0; // only flag if any non-credit sales exist
//     return {
//       ...row,
//       product,
//       sold,
//       expectedRemaining,
//       expectedRevenue,
//       actualCollected,
//       cashVariance,
//       hasCreditSales,
//       qtyAlert,
//       cashAlert,
//     };
//   });

//   const hasAlert = computed.some((r) => r.qtyAlert || r.cashAlert);

//   const addRow = () =>
//     setRows((r) => [
//       ...r,
//       { id: Date.now(), productId: "", openingQty: 0, damagedQty: 0 },
//     ]);
//   const removeRow = (id) => setRows((r) => r.filter((x) => x.id !== id));
//   const update = (id, field, val) =>
//     setRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: val } : x)));

//   const inputStyle = (amber) => ({
//     width: 72,
//     padding: "6px 10px",
//     borderRadius: 8,
//     border: `1.5px solid ${amber ? "#fde68a" : "#e5e7eb"}`,
//     fontSize: 12,
//     background: amber ? "#fffbeb" : "#fafafa",
//     color: amber ? "#92400e" : "#111827",
//     outline: "none",
//   });

//   return (
//     <Section
//       title='Daily Stock Reconciliation'
//       icon={Package}
//       accent='#d97706'
//       borderColor='#fde68a'
//       badge={
//         hasAlert
//           ? { label: "⚠ Discrepancy Detected", bg: "#fef2f2", color: "#dc2626" }
//           : { label: "✓ All Clear", bg: "#f0fdf4", color: "#16a34a" }
//       }>
//       <div style={{ overflowX: "auto" }}>
//         <table
//           style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
//           <thead>
//             <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
//               {[
//                 "Product",
//                 "Opening Stock",
//                 "Damaged / Written Off",
//                 "Sold Today (auto)",
//                 "Expected Remaining",
//                 "Expected Revenue",
//                 "Actual Collected",
//                 "Cash Variance",
//                 "Status",
//                 "",
//               ].map((h) => (
//                 <th
//                   key={h}
//                   style={{
//                     padding: "8px 12px",
//                     textAlign: "left",
//                     fontSize: 10,
//                     fontWeight: 700,
//                     letterSpacing: "0.09em",
//                     textTransform: "uppercase",
//                     color: "#d1d5db",
//                     whiteSpace: "nowrap",
//                   }}>
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {computed.map((row) => {
//               const st =
//                 row.qtyAlert && row.cashAlert
//                   ? "both"
//                   : row.qtyAlert
//                     ? "qty"
//                     : row.cashAlert
//                       ? "cash"
//                       : "ok";
//               const statusMap = {
//                 ok: {
//                   bg: "#f0fdf4",
//                   color: "#16a34a",
//                   border: "#bbf7d0",
//                   label: "Clear",
//                 },
//                 qty: {
//                   bg: "#fef2f2",
//                   color: "#dc2626",
//                   border: "#fecaca",
//                   label: "Qty Missing",
//                 },
//                 cash: {
//                   bg: "#fff7ed",
//                   color: "#c2410c",
//                   border: "#fed7aa",
//                   label: "Cash Short",
//                 },
//                 both: {
//                   bg: "#fef2f2",
//                   color: "#991b1b",
//                   border: "#fecaca",
//                   label: "Both Flagged",
//                 },
//               };
//               const s = statusMap[st];
//               return (
//                 <tr
//                   key={row.id}
//                   style={{ borderBottom: "1px solid #f9fafb" }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "#fffbeb")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background = "#fff")
//                   }>
//                   <td style={{ padding: "10px 12px", minWidth: 160 }}>
//                     <select
//                       value={row.productId}
//                       onChange={(e) =>
//                         update(row.id, "productId", e.target.value)
//                       }
//                       disabled={locked}
//                       style={{
//                         padding: "6px 10px",
//                         borderRadius: 8,
//                         border: "1.5px solid #e5e7eb",
//                         fontSize: 12,
//                         background: "#fafafa",
//                         color: "#111827",
//                         outline: "none",
//                         minWidth: 150,
//                       }}>
//                       <option value=''>Select…</option>
//                       {MOCK_PRODUCTS.map((p) => (
//                         <option key={p._id} value={p._id}>
//                           {p.productName}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td style={{ padding: "10px 12px" }}>
//                     <input
//                       type='number'
//                       min='0'
//                       value={row.openingQty}
//                       disabled={locked}
//                       onChange={(e) =>
//                         update(
//                           row.id,
//                           "openingQty",
//                           parseInt(e.target.value) || 0,
//                         )
//                       }
//                       style={inputStyle(false)}
//                     />
//                   </td>
//                   <td style={{ padding: "10px 12px" }}>
//                     <input
//                       type='number'
//                       min='0'
//                       value={row.damagedQty}
//                       disabled={locked}
//                       onChange={(e) =>
//                         update(
//                           row.id,
//                           "damagedQty",
//                           parseInt(e.target.value) || 0,
//                         )
//                       }
//                       style={inputStyle(true)}
//                     />
//                     {row.damagedQty > 0 && (
//                       <span
//                         style={{
//                           fontSize: 10,
//                           color: "#b45309",
//                           marginLeft: 4,
//                         }}>
//                         write-off
//                       </span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       padding: "10px 12px",
//                       fontWeight: 700,
//                       color: "#f43f5e",
//                       fontVariantNumeric: "tabular-nums",
//                       textAlign: "center",
//                     }}>
//                     {row.sold}
//                     {row.hasCreditSales && (
//                       <span
//                         style={{
//                           fontSize: 10,
//                           color: "#c2410c",
//                           marginLeft: 4,
//                         }}>
//                         (incl. credit)
//                       </span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       padding: "10px 12px",
//                       fontWeight: 800,
//                       fontVariantNumeric: "tabular-nums",
//                       color: row.qtyAlert ? "#dc2626" : "#059669",
//                     }}>
//                     {row.expectedRemaining}
//                     {row.qtyAlert && (
//                       <span style={{ fontSize: 10, marginLeft: 4 }}>
//                         ({Math.abs(row.expectedRemaining)} missing!)
//                       </span>
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       padding: "10px 12px",
//                       color: "#6b7280",
//                       fontVariantNumeric: "tabular-nums",
//                       fontSize: 12,
//                     }}>
//                     {fmt(row.expectedRevenue)}
//                   </td>
//                   <td
//                     style={{
//                       padding: "10px 12px",
//                       fontWeight: 700,
//                       color: "#111827",
//                       fontVariantNumeric: "tabular-nums",
//                     }}>
//                     {fmt(row.actualCollected)}
//                   </td>
//                   <td
//                     style={{
//                       padding: "10px 12px",
//                       fontWeight: 800,
//                       fontVariantNumeric: "tabular-nums",
//                       color:
//                         row.cashVariance < 0
//                           ? "#dc2626"
//                           : row.cashVariance > 0
//                             ? "#059669"
//                             : "#9ca3af",
//                     }}>
//                     {row.cashVariance >= 0 ? "+" : ""}
//                     {fmt(row.cashVariance)}
//                   </td>
//                   <td style={{ padding: "10px 12px" }}>
//                     <span
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: 5,
//                         padding: "4px 10px",
//                         borderRadius: 20,
//                         fontSize: 11,
//                         fontWeight: 700,
//                         background: s.bg,
//                         color: s.color,
//                         border: `1px solid ${s.border}`,
//                         whiteSpace: "nowrap",
//                       }}>
//                       {s.label}
//                     </span>
//                   </td>
//                   <td style={{ padding: "10px 8px" }}>
//                     {!locked && (
//                       <button
//                         onClick={() => removeRow(row.id)}
//                         style={{
//                           background: "none",
//                           border: "none",
//                           cursor: "pointer",
//                           color: "#fca5a5",
//                           padding: 4,
//                         }}>
//                         <Trash2 size={13} />
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Alert summary */}
//       {hasAlert && (
//         <div
//           style={{
//             marginTop: 16,
//             padding: "14px 18px",
//             borderRadius: 12,
//             background: "#fef2f2",
//             border: "1.5px solid #fecaca",
//             display: "flex",
//             gap: 12,
//             alignItems: "flex-start",
//           }}>
//           <ShieldAlert
//             size={18}
//             style={{ color: "#dc2626", flexShrink: 0, marginTop: 1 }}
//           />
//           <div>
//             <p
//               style={{
//                 fontSize: 13,
//                 fontWeight: 700,
//                 color: "#991b1b",
//                 marginBottom: 6,
//               }}>
//               Flagged for Admin Review
//             </p>
//             {computed
//               .filter((r) => r.qtyAlert)
//               .map((r) => (
//                 <p
//                   key={`q${r.id}`}
//                   style={{ fontSize: 12, color: "#b91c1c", marginBottom: 3 }}>
//                   📦 <strong>{r.product?.productName}</strong> —{" "}
//                   {Math.abs(r.expectedRemaining)} unit
//                   {Math.abs(r.expectedRemaining) !== 1 ? "s" : ""} unaccounted
//                   for
//                 </p>
//               ))}
//             {computed
//               .filter((r) => r.cashAlert)
//               .map((r) => (
//                 <p
//                   key={`c${r.id}`}
//                   style={{ fontSize: 12, color: "#c2410c", marginBottom: 3 }}>
//                   💸 <strong>{r.product?.productName}</strong> —{" "}
//                   {fmt(Math.abs(r.cashVariance))} cash shortfall
//                 </p>
//               ))}
//           </div>
//         </div>
//       )}

//       {/* Actions */}
//       {!locked ? (
//         <div
//           style={{
//             marginTop: 16,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}>
//           <button
//             onClick={addRow}
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "8px 14px",
//               borderRadius: 10,
//               fontSize: 12,
//               fontWeight: 700,
//               background: "#fff",
//               color: "#d97706",
//               border: "1.5px solid #fde68a",
//               cursor: "pointer",
//             }}>
//             <Plus size={13} /> Add Product Row
//           </button>
//           <button
//             onClick={() => setLocked(true)}
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 6,
//               padding: "9px 20px",
//               borderRadius: 10,
//               fontSize: 12,
//               fontWeight: 700,
//               background: "linear-gradient(135deg,#f59e0b,#d97706)",
//               color: "#fff",
//               border: "none",
//               cursor: "pointer",
//               boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
//             }}>
//             <ClipboardList size={13} /> Submit Stock Report
//           </button>
//         </div>
//       ) : (
//         <div
//           style={{
//             marginTop: 14,
//             display: "flex",
//             alignItems: "center",
//             gap: 10,
//             padding: "12px 16px",
//             borderRadius: 12,
//             background: "#f0fdf4",
//             border: "1px solid #bbf7d0",
//           }}>
//           <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
//           <p style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>
//             Stock report submitted.
//             {hasAlert ? " Admin has been notified of discrepancies." : ""}
//           </p>
//         </div>
//       )}
//     </Section>
//   );
// }

// // ─── 3. TODAY'S SALES TABLE ───────────────────────────────────────────────────

// function TodaySalesTable({ sales }) {
//   const COMM_RATE = 0.03;
//   const grandTotal = sales.reduce((a, s) => a + s.totalAmount, 0);
//   const commTotal =
//     sales
//       .filter((s) => s.paymentMethod !== "credit")
//       .reduce((a, s) => a + s.totalAmount, 0) * COMM_RATE;

//   return (
//     <Section
//       title="Today's Sales"
//       icon={ShoppingCart}
//       accent='#fda4af'
//       borderColor='#fce7e7'
//       badge={{
//         label: `${sales.length} transactions`,
//         bg: "#fff0f1",
//         color: "#f43f5e",
//       }}>
//       <div style={{ overflowX: "auto" }}>
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
//               {[
//                 "Time",
//                 "Product",
//                 "Qty",
//                 "Unit Price",
//                 "Amount",
//                 "Commission",
//                 "Payment",
//                 "Type",
//                 "Customer",
//               ].map((h) => (
//                 <th
//                   key={h}
//                   style={{
//                     padding: "8px 14px",
//                     textAlign: "left",
//                     fontSize: 10,
//                     fontWeight: 700,
//                     letterSpacing: "0.1em",
//                     textTransform: "uppercase",
//                     color: "#d1d5db",
//                     whiteSpace: "nowrap",
//                   }}>
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {sales.map((sale, i) => {
//               const badge = PAYMENT_BADGE[sale.paymentMethod] ?? {
//                 bg: "#f3f4f6",
//                 color: "#6b7280",
//                 border: "#e5e7eb",
//                 label: sale.paymentMethod,
//               };
//               const comm =
//                 sale.paymentMethod !== "credit"
//                   ? sale.totalAmount * COMM_RATE
//                   : 0;
//               return (
//                 <tr
//                   key={sale._id}
//                   style={{
//                     borderBottom: "1px solid #f9fafb",
//                     background: i % 2 === 0 ? "#fff" : "#fffbfb",
//                     transition: "background .15s",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.background = "#fff0f1")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.background =
//                       i % 2 === 0 ? "#fff" : "#fffbfb")
//                   }>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       fontSize: 12,
//                       color: "#9ca3af",
//                       whiteSpace: "nowrap",
//                     }}>
//                     {new Date(sale._creationTime).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </td>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       fontWeight: 700,
//                       color: "#111827",
//                       fontSize: 13,
//                     }}>
//                     {sale.product?.productName}
//                   </td>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       textAlign: "center",
//                       fontWeight: 700,
//                       color: "#374151",
//                     }}>
//                     {sale.quantitySold}
//                   </td>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       color: "#6b7280",
//                       fontSize: 13,
//                     }}>
//                     {fmt(sale.unitPrice)}
//                   </td>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       fontWeight: 800,
//                       color: "#f43f5e",
//                       fontSize: 14,
//                     }}>
//                     {fmt(sale.totalAmount)}
//                   </td>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       fontWeight: 700,
//                       color:
//                         sale.paymentMethod === "credit" ? "#d1d5db" : "#10b981",
//                       fontSize: 13,
//                     }}>
//                     {sale.paymentMethod === "credit" ? "—" : fmt(comm)}
//                   </td>
//                   <td style={{ padding: "11px 14px" }}>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         padding: "3px 10px",
//                         borderRadius: 6,
//                         fontSize: 10,
//                         fontWeight: 700,
//                         textTransform: "uppercase",
//                         letterSpacing: "0.08em",
//                         background: badge.bg,
//                         color: badge.color,
//                         border: `1px solid ${badge.border}`,
//                       }}>
//                       {badge.label}
//                     </span>
//                   </td>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       fontSize: 12,
//                       color: "#6b7280",
//                     }}>
//                     {sale.saleType === "transport" ? "🚚 Transport" : "🏪 Shop"}
//                   </td>
//                   <td
//                     style={{
//                       padding: "11px 14px",
//                       fontSize: 12,
//                       color: "#9ca3af",
//                     }}>
//                     {sale.customerName ?? (
//                       <span style={{ color: "#e5e7eb" }}>—</span>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//           <tfoot>
//             <tr
//               style={{
//                 borderTop: "1.5px solid #fce7e7",
//                 background: "#fff9f9",
//               }}>
//               <td
//                 colSpan={4}
//                 style={{
//                   padding: "12px 14px",
//                   fontSize: 11,
//                   fontWeight: 700,
//                   textAlign: "right",
//                   color: "#9ca3af",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.1em",
//                 }}>
//                 Total
//               </td>
//               <td
//                 style={{
//                   padding: "12px 14px",
//                   fontWeight: 800,
//                   color: "#f43f5e",
//                   fontSize: 16,
//                 }}>
//                 {fmt(grandTotal)}
//               </td>
//               <td
//                 style={{
//                   padding: "12px 14px",
//                   fontWeight: 800,
//                   color: "#10b981",
//                   fontSize: 14,
//                 }}>
//                 {fmt(commTotal)}
//               </td>
//               <td colSpan={3} />
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </Section>
//   );
// }

// // ─── 4. DEBTOR REPAYMENTS ─────────────────────────────────────────────────────

// function DebtorRepayments({ onTotalChange }) {
//   const [repayments, setRepayments] = useState([
//     {
//       id: 1,
//       debtorName: "Emeka Ltd",
//       amount: 32500,
//       note: "Part payment for last week",
//     },
//   ]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({ debtorName: "", amount: "", note: "" });

//   const total = repayments.reduce((a, r) => a + Number(r.amount), 0);

//   const save = () => {
//     if (!form.debtorName || !form.amount) return;
//     const updated = [
//       ...repayments,
//       {
//         id: Date.now(),
//         debtorName: form.debtorName,
//         amount: Number(form.amount),
//         note: form.note,
//       },
//     ];
//     setRepayments(updated);
//     onTotalChange(updated.reduce((a, r) => a + Number(r.amount), 0));
//     setForm({ debtorName: "", amount: "", note: "" });
//     setShowForm(false);
//   };

//   const remove = (id) => {
//     const updated = repayments.filter((r) => r.id !== id);
//     setRepayments(updated);
//     onTotalChange(updated.reduce((a, r) => a + Number(r.amount), 0));
//   };

//   const inputStyle = {
//     padding: "8px 12px",
//     borderRadius: 8,
//     border: "1.5px solid #dbeafe",
//     fontSize: 13,
//     color: "#111827",
//     background: "#fff",
//     outline: "none",
//     width: "100%",
//     boxSizing: "border-box",
//   };

//   return (
//     <Section
//       title='Debtor Repayments'
//       icon={UserCheck}
//       accent='#3b82f6'
//       borderColor='#dbeafe'
//       badge={{
//         label: `${repayments.length} logged · ${fmt(total)} → counts as cash`,
//         bg: "#eff6ff",
//         color: "#1d4ed8",
//       }}>
//       {repayments.length === 0 && !showForm && (
//         <p
//           style={{
//             fontSize: 13,
//             color: "#9ca3af",
//             textAlign: "center",
//             padding: "20px 0",
//           }}>
//           No repayments logged yet.
//         </p>
//       )}

//       {repayments.length > 0 && (
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 8,
//             marginBottom: 12,
//           }}>
//           {repayments.map((r) => (
//             <div
//               key={r.id}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 padding: "12px 14px",
//                 borderRadius: 12,
//                 background: "#f0f9ff",
//                 border: "1px solid #bae6fd",
//               }}>
//               <div
//                 style={{
//                   width: 34,
//                   height: 34,
//                   borderRadius: "50%",
//                   background: "#dbeafe",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}>
//                 <UserCheck size={15} style={{ color: "#2563eb" }} />
//               </div>
//               <div style={{ flex: 1 }}>
//                 <p style={{ fontSize: 13, fontWeight: 700, color: "#1e40af" }}>
//                   {r.debtorName}
//                 </p>
//                 {r.note && (
//                   <p style={{ fontSize: 11, color: "#60a5fa", marginTop: 2 }}>
//                     {r.note}
//                   </p>
//                 )}
//               </div>
//               <p
//                 style={{
//                   fontSize: 15,
//                   fontWeight: 800,
//                   color: "#1d4ed8",
//                   fontFamily: "Georgia,serif",
//                 }}>
//                 {fmt(r.amount)}
//               </p>
//               <button
//                 onClick={() => remove(r.id)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   cursor: "pointer",
//                   color: "#93c5fd",
//                   padding: 4,
//                 }}>
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: "10px 16px",
//               borderRadius: 10,
//               background: "#1d4ed8",
//               marginTop: 4,
//             }}>
//             <span
//               style={{
//                 fontSize: 11,
//                 fontWeight: 700,
//                 color: "rgba(255,255,255,0.75)",
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//               }}>
//               Total Repayments → Added to Cash Reconciliation
//             </span>
//             <span
//               style={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: "#fff",
//                 fontFamily: "Georgia,serif",
//               }}>
//               {fmt(total)}
//             </span>
//           </div>
//         </div>
//       )}

//       {showForm && (
//         <div
//           style={{
//             padding: 16,
//             borderRadius: 12,
//             background: "#f8fafc",
//             border: "1.5px solid #dbeafe",
//             marginBottom: 12,
//           }}>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 2fr",
//               gap: 10,
//             }}>
//             <div>
//               <label
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.1em",
//                   display: "block",
//                   marginBottom: 6,
//                 }}>
//                 Debtor Name *
//               </label>
//               <input
//                 value={form.debtorName}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, debtorName: e.target.value }))
//                 }
//                 placeholder='Customer / Company'
//                 style={inputStyle}
//               />
//             </div>
//             <div>
//               <label
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.1em",
//                   display: "block",
//                   marginBottom: 6,
//                 }}>
//                 Amount (₦) *
//               </label>
//               <input
//                 type='number'
//                 min='0'
//                 value={form.amount}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, amount: e.target.value }))
//                 }
//                 placeholder='0'
//                 style={inputStyle}
//               />
//             </div>
//             <div>
//               <label
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.1em",
//                   display: "block",
//                   marginBottom: 6,
//                 }}>
//                 Note (optional)
//               </label>
//               <input
//                 value={form.note}
//                 onChange={(e) =>
//                   setForm((f) => ({ ...f, note: e.target.value }))
//                 }
//                 placeholder='e.g. Full payment, invoice #12…'
//                 style={inputStyle}
//               />
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               gap: 8,
//               marginTop: 12,
//               justifyContent: "flex-end",
//             }}>
//             <button
//               onClick={() => setShowForm(false)}
//               style={{
//                 padding: "7px 14px",
//                 borderRadius: 8,
//                 fontSize: 12,
//                 fontWeight: 700,
//                 background: "#fff",
//                 color: "#6b7280",
//                 border: "1.5px solid #e5e7eb",
//                 cursor: "pointer",
//               }}>
//               Cancel
//             </button>
//             <button
//               onClick={save}
//               style={{
//                 padding: "7px 16px",
//                 borderRadius: 8,
//                 fontSize: 12,
//                 fontWeight: 700,
//                 background: "#2563eb",
//                 color: "#fff",
//                 border: "none",
//                 cursor: "pointer",
//               }}>
//               Save
//             </button>
//           </div>
//         </div>
//       )}

//       {!showForm && (
//         <button
//           onClick={() => setShowForm(true)}
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 6,
//             padding: "8px 14px",
//             borderRadius: 10,
//             fontSize: 12,
//             fontWeight: 700,
//             background: "#eff6ff",
//             color: "#2563eb",
//             border: "1.5px solid #bfdbfe",
//             cursor: "pointer",
//             marginTop: repayments.length > 0 ? 4 : 0,
//           }}>
//           <Plus size={13} /> Log Repayment
//         </button>
//       )}
//     </Section>
//   );
// }

// // ─── 5. CASH RECONCILIATION ───────────────────────────────────────────────────

// function CashReconciliation({ sales, debtorTotal }) {
//   const [opening, setOpening] = useState("");
//   const [closing, setClosing] = useState("");
//   const [notes, setNotes] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const cashSales = sales
//     .filter((s) => s.paymentMethod === "cash")
//     .reduce((a, s) => a + s.totalAmount, 0);
//   const expectedCash = Number(opening || 0) + cashSales + debtorTotal;
//   const variance = Number(closing || 0) - expectedCash;
//   const hasPreview = opening !== "" || closing !== "";

//   const breakdownRows = [
//     {
//       label: "Opening Cash",
//       value: fmt(Number(opening || 0)),
//       color: "#374151",
//     },
//     { label: "+ Cash Sales", value: fmt(cashSales), color: "#059669" },
//     { label: "+ Debtor Repayments", value: fmt(debtorTotal), color: "#2563eb" },
//     {
//       label: "= Expected Total",
//       value: fmt(expectedCash),
//       color: "#111827",
//       bold: true,
//       divider: true,
//     },
//     {
//       label: "Closing Cash",
//       value: fmt(Number(closing || 0)),
//       color: "#111827",
//       bold: true,
//     },
//     {
//       label: "Variance",
//       value: `${variance >= 0 ? "+" : ""}${fmt(variance)}`,
//       color: variance < 0 ? "#dc2626" : variance > 0 ? "#059669" : "#9ca3af",
//       bold: true,
//     },
//   ];

//   const inputStyle = {
//     padding: "9px 12px 9px 28px",
//     borderRadius: 10,
//     border: "1.5px solid #e5e7eb",
//     fontSize: 13,
//     color: "#111827",
//     background: "#fafafa",
//     outline: "none",
//     width: "100%",
//     boxSizing: "border-box",
//   };

//   return (
//     <Section
//       title='Cash Reconciliation'
//       icon={Wallet}
//       accent='#f59e0b'
//       borderColor='#fde68a'>
//       {submitted ? (
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 12,
//             padding: "14px 16px",
//             borderRadius: 12,
//             background: "#f0fdf4",
//             border: "1px solid #bbf7d0",
//           }}>
//           <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
//           <div>
//             <p style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>
//               Cash report submitted
//             </p>
//             <p style={{ fontSize: 12, color: "#4ade80", marginTop: 2 }}>
//               {variance < 0
//                 ? `⚠ ${fmt(Math.abs(variance))} deficit flagged for admin.`
//                 : `Variance: ${fmt(Math.abs(variance))} ${variance > 0 ? "surplus" : "(balanced)"}.`}
//             </p>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 2fr",
//               gap: 14,
//               marginBottom: 16,
//             }}>
//             {[
//               {
//                 label: "Opening Cash (₦) *",
//                 state: opening,
//                 set: setOpening,
//                 hint: "Cash you started with",
//               },
//               {
//                 label: "Closing Cash (₦) *",
//                 state: closing,
//                 set: setClosing,
//                 hint: "Cash in drawer now",
//               },
//             ].map(({ label, state, set, hint }) => (
//               <div key={label}>
//                 <label
//                   style={{
//                     fontSize: 10,
//                     fontWeight: 700,
//                     color: "#6b7280",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.1em",
//                     display: "block",
//                     marginBottom: 6,
//                   }}>
//                   {label}
//                 </label>
//                 <div style={{ position: "relative" }}>
//                   <span
//                     style={{
//                       position: "absolute",
//                       left: 12,
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       fontSize: 13,
//                       color: "#9ca3af",
//                     }}>
//                     ₦
//                   </span>
//                   <input
//                     type='number'
//                     min='0'
//                     value={state}
//                     onChange={(e) => set(e.target.value)}
//                     placeholder='0'
//                     style={inputStyle}
//                   />
//                 </div>
//                 <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
//                   {hint}
//                 </p>
//               </div>
//             ))}
//             <div>
//               <label
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#6b7280",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.1em",
//                   display: "block",
//                   marginBottom: 6,
//                 }}>
//                 Notes
//               </label>
//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 rows={2}
//                 placeholder="Any notes about today's cash…"
//                 style={{
//                   width: "100%",
//                   padding: "9px 12px",
//                   borderRadius: 10,
//                   border: "1.5px solid #e5e7eb",
//                   fontSize: 13,
//                   color: "#111827",
//                   background: "#fafafa",
//                   outline: "none",
//                   resize: "none",
//                   boxSizing: "border-box",
//                   fontFamily: "inherit",
//                 }}
//               />
//             </div>
//           </div>

//           {/* Live breakdown */}
//           {hasPreview && (
//             <div
//               style={{
//                 borderRadius: 12,
//                 background: "#fffbeb",
//                 border: "1.5px solid #fde68a",
//                 padding: "16px 18px",
//                 marginBottom: 16,
//               }}>
//               <p
//                 style={{
//                   fontSize: 10,
//                   fontWeight: 700,
//                   color: "#92400e",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.1em",
//                   marginBottom: 14,
//                 }}>
//                 Cash Breakdown
//               </p>
//               <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
//                 {breakdownRows.map(({ label, value, color, bold, divider }) => (
//                   <div key={label}>
//                     {divider && (
//                       <div
//                         style={{
//                           height: 1,
//                           background: "#fcd34d",
//                           margin: "8px 0",
//                         }}
//                       />
//                     )}
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         padding: "5px 0",
//                       }}>
//                       <span
//                         style={{
//                           fontSize: 12,
//                           color: "#a16207",
//                           fontWeight: bold ? 700 : 400,
//                         }}>
//                         {label}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: bold ? 15 : 13,
//                           fontWeight: bold ? 800 : 600,
//                           color,
//                           fontFamily: bold ? "Georgia,serif" : "inherit",
//                         }}>
//                         {value}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {variance < 0 && (
//                 <div
//                   style={{
//                     marginTop: 12,
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     padding: "9px 12px",
//                     borderRadius: 8,
//                     background: "#fef2f2",
//                     border: "1px solid #fecaca",
//                   }}>
//                   <AlertTriangle size={13} style={{ color: "#dc2626" }} />
//                   <p
//                     style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
//                     Cash is short by {fmt(Math.abs(variance))} — will be flagged
//                     for admin review.
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}

//           <div style={{ display: "flex", justifyContent: "flex-end" }}>
//             <button
//               onClick={() => {
//                 if (opening && closing) setSubmitted(true);
//               }}
//               disabled={!opening || !closing}
//               style={{
//                 padding: "9px 22px",
//                 borderRadius: 10,
//                 fontSize: 13,
//                 fontWeight: 700,
//                 border: "none",
//                 cursor: opening && closing ? "pointer" : "not-allowed",
//                 background:
//                   opening && closing
//                     ? "linear-gradient(135deg,#f59e0b,#d97706)"
//                     : "#e5e7eb",
//                 color: opening && closing ? "#fff" : "#9ca3af",
//                 boxShadow:
//                   opening && closing
//                     ? "0 4px 14px rgba(245,158,11,0.3)"
//                     : "none",
//               }}>
//               Submit Cash Report
//             </button>
//           </div>
//         </>
//       )}
//     </Section>
//   );
// }

// // ─── ROOT ─────────────────────────────────────────────────────────────────────

// export default function SalesDashboard() {
//   const [debtorTotal, setDebtorTotal] = useState(32500);

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f9fafb",
//         fontFamily: "'Helvetica Neue',Arial,sans-serif",
//         padding: "32px",
//         maxWidth: 1200,
//         margin: "0 auto",
//       }}>
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           marginBottom: 20,
//         }}>
//         <div>
//           <h1
//             style={{
//               fontSize: 26,
//               fontWeight: 800,
//               color: "#111827",
//               letterSpacing: "-0.02em",
//               fontFamily: "Georgia,serif",
//               margin: 0,
//             }}>
//             Welcome, Chidi Okeke 👋
//           </h1>
//           <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
//             {todayLabel}
//           </p>
//         </div>
//         <button
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 8,
//             padding: "10px 18px",
//             borderRadius: 12,
//             fontSize: 13,
//             fontWeight: 700,
//             background: "linear-gradient(135deg,#f43f5e,#e11d48)",
//             color: "#fff",
//             border: "none",
//             cursor: "pointer",
//             boxShadow: "0 4px 14px rgba(244,63,94,0.3)",
//           }}>
//           <Plus size={15} strokeWidth={2.5} /> Record Sale
//         </button>
//       </div>

//       {/* Daily flow pill */}
//       <div
//         style={{
//           display: "inline-flex",
//           alignItems: "center",
//           gap: 6,
//           marginBottom: 20,
//           padding: "9px 16px",
//           borderRadius: 10,
//           background: "#fff",
//           border: "1.5px solid #e5e7eb",
//           fontSize: 12,
//         }}>
//         {[
//           "📦 Morning Stock",
//           "→",
//           "🛒 Record Sales",
//           "→",
//           "👤 Log Repayments",
//           "→",
//           "💰 Reconcile Cash",
//         ].map((s, i) => (
//           <span
//             key={i}
//             style={{
//               color: s === "→" ? "#d1d5db" : "#374151",
//               fontWeight: s === "→" ? 400 : 600,
//             }}>
//             {s}
//           </span>
//         ))}
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//         <KpiCards sales={MOCK_SALES} />
//         <StockReconciliation sales={MOCK_SALES} />
//         <TodaySalesTable sales={MOCK_SALES} />
//         <DebtorRepayments onTotalChange={setDebtorTotal} />
//         <CashReconciliation sales={MOCK_SALES} debtorTotal={debtorTotal} />
//       </div>
//     </div>
//   );
// }
