# 🗺️ Route Structure Guide

## Overview of All Routes

Here's the complete routing structure for your app:

```
/                           → Dashboard (Owner's view)
├── /staff                  → Staff list
│   └── /staff/new         → Add new staff (TODO)
│
├── /operations            → Daily operations list
│   ├── /operations/new    → Create new daily log ✅ JUST CREATED
│   └── /operations/[id]   → View operation details (TODO)
│
├── /inventory             → Inventory list
│   └── /inventory/new     → Add inventory item (TODO)
│
├── /commission            → Commission records
│   └── /commission/new    → Calculate commission (TODO)
│
├── /imprest               → Imprest requests
│   └── /imprest/new       → New imprest request (TODO)
│
└── /reports               → Reports & analytics
```

---

## ✅ New Daily Log Route

**Path:** `/operations/new`

### What It Does

1. **Form to create a daily operation entry** with:
   - Operation date (defaults to today)
   - Opening cash
   - Closing cash
   - Total sales
   - Total expenses
   - Notes (optional)

2. **Auto-calculations** (live preview):
   - Net Profit = Total Sales - Total Expenses
   - Expected Cash = Opening + Sales - Expenses
   - Cash Variance = Closing - Expected Cash

3. **Validation**:
   - Prevents duplicate entries for same date
   - All cash fields required
   - Shows warning if variance > ₦100

4. **After saving**:
   - Redirects to `/operations` (the list page)
   - New entry appears in the operations table
   - Status starts as "open"

---

## 📋 Form Fields Explained

### Opening Cash

- Cash in the register at start of day
- Example: ₦50,000

### Closing Cash

- Cash in the register at end of day
- Example: ₦125,000

### Total Sales

- All revenue collected today
- Example: ₦200,000

### Total Expenses

- All costs incurred today
- Example: ₦75,000

### Auto-Calculated Fields

**Net Profit:**

```
Net Profit = Total Sales - Total Expenses
Example: ₦200,000 - ₦75,000 = ₦125,000
```

**Expected Cash:**

```
Expected Cash = Opening Cash + Total Sales - Total Expenses
Example: ₦50,000 + ₦200,000 - ₦75,000 = ₦175,000
```

**Cash Variance:**

```
Cash Variance = Closing Cash - Expected Cash
Example: ₦125,000 - ₦175,000 = -₦50,000 (shortage!)
```

### Cash Variance Meaning

- **Positive (+)**: More cash than expected (overage)
- **Negative (-)**: Less cash than expected (shortage)
- **Close to 0**: Perfect match ✅
- **> ₦100 variance**: ⚠️ Warning shown (investigate!)

---

## 🎨 UI Features

### Visual Feedback

- ✅ Green for profit, red for loss
- ✅ Color-coded variance (red if > ₦100)
- ✅ Loading spinner while saving
- ✅ Formula explanation box
- ✅ Real-time calculation preview

### User Experience

- ✅ Back button to operations list
- ✅ Cancel button (no save)
- ✅ Auto-focus on date field
- ✅ Number inputs with 2 decimal places
- ✅ Helper text under each field

---

## 🔧 Backend (Convex)

### Mutation: `operationsMutations.create`

```typescript
await createOperation({
  operationDate: "2026-02-05",
  openingCash: 50000,
  closingCash: 125000,
  totalSales: 200000,
  totalExpenses: 75000,
  cashVariance: -50000, // Auto-calculated
  notes: "Staff shortage today",
  status: "open",
});
```

### Duplicate Prevention

The mutation checks if an operation already exists for the date:

```typescript
if (existing) {
  throw new Error("Daily operation already exists for this date");
}
```

This prevents creating multiple logs for the same day.

---

## 📊 How It Connects

### Dashboard → New Log

```
Dashboard "New Daily Log" button
  ↓
/operations/new (form)
  ↓
Fill form & click "Save"
  ↓
Convex mutation creates record
  ↓
Redirect to /operations (list)
  ↓
New entry appears in table
```

### Navigation Flow

```
/ (Dashboard)
  → Click "New Daily Log"
    → /operations/new (form)
      → Fill & Save
        → /operations (list)
          → See your new entry!
```

---

## 🎯 Similar Routes to Create Next

Following the same pattern, you'd create:

### `/staff/new` (Add New Staff)

```typescript
// Form fields:
(-employeeId - fullName - email,
  phone - role(dropdown) - status(dropdown) - dateHired - commissionRate);
```

### `/inventory/new` (Add Inventory Item)

```typescript
// Form fields:
-itemName -
  category(dropdown) -
  unit -
  reorderLevel -
  currentStock -
  unitCost -
  supplierId(dropdown);
```

### `/commission/new` (Calculate Commission)

```typescript
// Form fields:
- staffId (dropdown)
- periodStart, periodEnd
- Auto-fetch sales
- Auto-calculate commission
- Add deductions/penalties
```

---

## 💡 Key Patterns Used

### 1. Form State Management

```typescript
const [formData, setFormData] = useState({
  field1: "",
  field2: "",
});

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};
```

### 2. Convex Mutation

```typescript
const createSomething = useMutation(api.something.create);

await createSomething({ ...data });
```

### 3. Navigation After Save

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/somewhere");
```

### 4. Loading States

```typescript
const [loading, setLoading] = useState(false);

setLoading(true);
await mutation();
setLoading(false);
```

---

## ✅ What Works Now

- ✅ `/operations/new` route exists
- ✅ Form with all fields
- ✅ Live calculation preview
- ✅ Saves to Convex database
- ✅ Redirects after save
- ✅ Duplicate date prevention
- ✅ Error handling
- ✅ Loading states

---

## 🚀 Next Steps

1. **Test the form:**
   - Go to http://localhost:3000/operations/new
   - Fill in the fields
   - Click "Save Daily Log"
   - Check `/operations` list

2. **Create similar forms:**
   - `/staff/new`
   - `/inventory/new`
   - `/commission/new`
   - `/imprest/new`

3. **Add edit routes:**
   - `/operations/[id]/edit`
   - `/staff/[id]/edit`
   - etc.

---

**The `/operations/new` route is complete and ready to use!** ✅
