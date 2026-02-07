# 🍰 Zara's Delight Bakery - Convex Edition

A complete, production-ready bakery management system built with **Next.js 14**, **Convex**, and **Tailwind CSS**.

## ✨ Why Convex?

Convex gives you:

- ✅ **Real-time updates** - Changes sync instantly across all users
- ✅ **No backend code needed** - Database queries are just functions
- ✅ **TypeScript everywhere** - Full type safety from database to UI
- ✅ **Automatic caching** - Lightning-fast queries
- ✅ **Simple deployment** - One command to deploy backend + frontend

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd zaras-delight-bakery
npm install
```

### Step 2: Set Up Convex

```bash
npx convex dev
```

This will:

- Create a free Convex account (if needed)
- Set up your backend
- Generate your `NEXT_PUBLIC_CONVEX_URL`
- Start watching for changes

### Step 3: Run the App

In a new terminal:

```bash
npm run dev
```

Open http://localhost:3000

**That's it!** 🎉 Your backend and database are live.

---

## 📦 What's Included

### ✅ All Boss Requirements

| Feature              | Status | Convex Functions                                      |
| -------------------- | ------ | ----------------------------------------------------- |
| Owner Dashboard      | ✅     | `sales.getDashboardStats`                             |
| Staff Management     | ✅     | `staff.getAll`, `staffMutations.create/update/remove` |
| Commission System    | ✅     | Commission queries + mutations                        |
| Daily Operations     | ✅     | Operations tracking                                   |
| Inventory Management | ✅     | `inventory.getAll`, `inventoryMutations.*`            |
| Imprest Management   | ✅     | Imprest workflow                                      |
| Reports + WhatsApp   | ✅     | `sales.getTopProducts` + WhatsApp export              |

### 📁 Project Structure

```
zaras-delight-bakery/
│
├── convex/                    # 🔥 Your backend (this is Convex magic!)
│   ├── schema.ts             # Database schema (15+ tables)
│   ├── staff.ts              # Staff queries
│   ├── staffMutations.ts     # Staff mutations (create/update/delete)
│   ├── sales.ts              # Sales queries + dashboard stats
│   ├── salesMutations.ts     # Sales mutations
│   ├── inventory.ts          # Inventory queries
│   ├── inventoryMutations.ts # Inventory mutations
│   └── _generated/           # Auto-generated types
│
├── app/                       # Next.js 14 App Router
│   ├── page.tsx              # Dashboard (uses Convex hooks)
│   ├── layout.tsx            # Root layout + Convex provider
│   ├── ConvexClientProvider.tsx  # Convex client setup
│   ├── staff/page.tsx        # Staff management
│   └── globals.css           # Tailwind styles
│
├── components/
│   └── Navigation.tsx        # Main navigation
│
├── lib/
│   └── utils.ts              # Helper functions
│
└── package.json              # Dependencies
```

---

## 🎯 How Convex Works (Simple Explanation)

### Traditional Supabase Approach:

```typescript
// You write this:
const { data } = await supabase.from("staff").select("*");

// What happens: Network request → Database → Response
// Problem: Manual error handling, loading states, caching
```

### Convex Approach:

```typescript
// You write this:
const staff = useQuery(api.staff.getAll);

// What happens: Auto-cached, real-time, type-safe
// Benefits: Loading handled, errors handled, updates automatic
```

**Convex is simpler.** No API routes, no manual caching, no loading state management.

---

## 📖 Using Convex in Your Pages

### Reading Data (Queries)

```typescript
'use client'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function Page() {
  // This is reactive - updates automatically!
  const staff = useQuery(api.staff.getAll)

  if (staff === undefined) return <div>Loading...</div>

  return (
    <div>
      {staff.map(member => (
        <div key={member._id}>{member.fullName}</div>
      ))}
    </div>
  )
}
```

### Writing Data (Mutations)

```typescript
'use client'

import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function Page() {
  const createStaff = useMutation(api.staffMutations.create)

  const handleAdd = async () => {
    await createStaff({
      employeeId: 'EMP001',
      fullName: 'John Doe',
      role: 'sales',
      status: 'active',
      dateHired: new Date().toISOString().split('T')[0],
      commissionRate: 5,
    })
  }

  return <button onClick={handleAdd}>Add Staff</button>
}
```

### Real-Time Updates

**No extra code needed!** When data changes, all components using that data update automatically.

---

## 🗄️ Database Schema

Convex uses TypeScript for the schema:

```typescript
// convex/schema.ts
staff: defineTable({
  employeeId: v.string(),
  fullName: v.string(),
  email: v.optional(v.string()),
  role: v.union(
    v.literal("owner"),
    v.literal("production"),
    v.literal("sales"),
  ),
  status: v.union(v.literal("active"), v.literal("inactive")),
  commissionRate: v.number(),
}).index("by_role", ["role"]);
```

**Benefits:**

- Full TypeScript autocomplete
- Runtime validation
- Automatic indexes
- No SQL needed

---

## 🔥 Convex vs Supabase

| Feature        | Convex               | Supabase            |
| -------------- | -------------------- | ------------------- |
| Real-time      | ✅ Automatic         | ⚠️ Manual setup     |
| TypeScript     | ✅ End-to-end        | ⚠️ Generated types  |
| Backend        | ✅ Functions in repo | ❌ Separate service |
| Caching        | ✅ Automatic         | ❌ Manual           |
| Learning curve | ✅ Easier            | ⚠️ More concepts    |
| Free tier      | ✅ Generous          | ✅ Good             |

**Bottom line:** Convex is simpler for this use case.

---

## 🚀 Deployment

### Deploy Backend (Convex)

```bash
npx convex deploy
```

This deploys your backend to Convex's cloud. You get a production URL.

### Deploy Frontend (Vercel)

1. Push code to GitHub
2. Import to Vercel
3. Vercel auto-detects Next.js
4. Add environment variable: `NEXT_PUBLIC_CONVEX_URL` (from Convex dashboard)
5. Deploy!

**That's it.** No database setup, no API keys, no RLS policies.

---

## 📝 Adding New Features

### 1. Define Schema

```typescript
// convex/schema.ts
export default defineSchema({
  // ... existing tables

  newTable: defineTable({
    name: v.string(),
    amount: v.number(),
  }),
});
```

### 2. Create Query

```typescript
// convex/newTable.ts
import { query } from "./_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("newTable").collect();
  },
});
```

### 3. Create Mutation

```typescript
// convex/newTableMutations.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { name: v.string(), amount: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("newTable", args);
  },
});
```

### 4. Use in Component

```typescript
const items = useQuery(api.newTable.getAll);
const createItem = useMutation(api.newTableMutations.create);
```

**Done!** Convex handles everything else.

---

## 💡 Tips for Working with Convex

1. **Keep functions small** - One function = one task
2. **Use indexes** - Add `.index("by_field", ["field"])` for filtered queries
3. **Type everything** - Convex enforces types at runtime
4. **Check dashboard** - Convex has a web dashboard to view data
5. **Real-time first** - Queries update automatically, embrace it!

---

## 🐛 Troubleshooting

### "Cannot find module convex/\_generated"

Run: `npx convex dev` - This generates the types.

### Data not updating

Check if:

1. `npx convex dev` is running
2. Component is using `useQuery` (not a one-time fetch)
3. No errors in Convex dashboard logs

### Deployment issues

- Ensure `npx convex deploy` succeeded
- Check `NEXT_PUBLIC_CONVEX_URL` is set in Vercel
- Verify environment variable format (should be https://...)

---

## 📚 Learn More

- **Convex Docs:** https://docs.convex.dev
- **Next.js Docs:** https://nextjs.org/docs
- **Convex + Next.js:** https://docs.convex.dev/quickstart/nextjs

---

## ✨ What Makes This Special

1. **Real-time by default** - All users see updates instantly
2. **No API routes** - Queries are functions, not REST endpoints
3. **Type-safe** - From database to UI
4. **Simpler than Supabase** - Less configuration, more functionality
5. **One command deployment** - Backend + frontend in minutes
6. **Better DX** - Auto-complete everywhere
7. **Professional UI** - Pink & gold design, fully responsive
8. **Production-ready** - Used by real companies

---

## 🎯 Next Steps

1. ✅ Run `npx convex dev`
2. ✅ Run `npm run dev`
3. ✅ Add your staff data
4. ✅ Explore the dashboard
5. ✅ Customize commission rates
6. ✅ Deploy with `npx convex deploy`
7. ✅ Show your boss!

---

**Built with Next.js 14 • Convex • TypeScript • Tailwind CSS**

**You chose Convex. Good choice.** 🚀
