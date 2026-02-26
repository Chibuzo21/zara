"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatCurrency } from "../../../lib/utils";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { useState } from "react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function ProductsPage() {
  const products = useQuery(api.products.getAll) || [];
  const createProduct = useMutation(api.productsMutations.create);
  const updateProduct = useMutation(api.productsMutations.update);
  const removeProduct = useMutation(api.productsMutations.remove);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"products"> | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    productName: "",
    category: "Bread",
    basePrice: "",
    productionCost: "",
    status: "active" as "active" | "inactive",
  });

  const categories = Array.from(new Set(products.map((p: any) => p.category)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await updateProduct({
          id: editingId,
          productName: formData.productName,
          category: formData.category,
          basePrice: parseFloat(formData.basePrice),
          productionCost: formData.productionCost
            ? parseFloat(formData.productionCost)
            : undefined,
          status: formData.status,
        });
      } else {
        await createProduct({
          productName: formData.productName,
          category: formData.category,
          basePrice: parseFloat(formData.basePrice),
          productionCost: formData.productionCost
            ? parseFloat(formData.productionCost)
            : undefined,
          status: formData.status,
        });
      }

      setFormData({
        productName: "",
        category: "Bread",
        basePrice: "",
        productionCost: "",
        status: "active",
      });
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      productName: product.productName,
      category: product.category,
      basePrice: product.basePrice.toString(),
      productionCost: product.productionCost?.toString() || "",
      status: product.status,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: Id<"products">) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await removeProduct({ id });
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const handleCancel = () => {
    setFormData({
      productName: "",
      category: "Bread",
      basePrice: "",
      productionCost: "",
      status: "active",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const filteredProducts = products.filter((p: any) => {
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const activeCount = products.filter((p: any) => p.status === "active").length;
  const totalValue = products.reduce(
    (sum: number, p: any) => sum + p.basePrice,
    0,
  );
  const avgPrice = products.length > 0 ? totalValue / products.length : 0;

  if (products === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='w-16 h-16 border-4 border-bakery-pink border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
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

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Total Products</p>
          <p className='text-3xl font-bold mt-2'>{products.length}</p>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Active Products</p>
          <p className='text-3xl font-bold mt-2'>{activeCount}</p>
        </div>

        <div className='bg-gradient-to-br from-bakery-pink to-bakery-gold text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Average Price</p>
          <p className='text-3xl font-bold mt-2'>{formatCurrency(avgPrice)}</p>
        </div>

        <div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg'>
          <p className='text-white/80 text-sm'>Categories</p>
          <p className='text-3xl font-bold mt-2'>{categories.length}</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className='card bg-blue-50 border-2 border-blue-200'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='label'>Product Name *</label>
                <input
                  type='text'
                  className='input-field'
                  placeholder='e.g., White Bread'
                  value={formData.productName}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className='label'>Category *</label>
                <input
                  type='text'
                  className='input-field'
                  placeholder='e.g., Bread, Cake, Pastry'
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className='label'>Selling Price (₦) *</label>
                <input
                  type='number'
                  className='input-field'
                  placeholder='1000'
                  step='0.01'
                  min='0'
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className='label'>Production Cost (₦)</label>
                <input
                  type='number'
                  className='input-field'
                  placeholder='500'
                  step='0.01'
                  min='0'
                  value={formData.productionCost}
                  onChange={(e) =>
                    setFormData({ ...formData, productionCost: e.target.value })
                  }
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Optional - for profit tracking
                </p>
              </div>

              <div>
                <label className='label'>Status *</label>
                <select
                  className='input-field'
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }>
                  <option value='active'>Active</option>
                  <option value='inactive'>Inactive</option>
                </select>
              </div>

              {formData.basePrice && formData.productionCost && (
                <div className='p-4 bg-white rounded-lg border border-blue-200'>
                  <p className='text-sm text-gray-600'>Profit Margin</p>
                  <p className='text-2xl font-bold text-green-600'>
                    {formatCurrency(
                      parseFloat(formData.basePrice) -
                        parseFloat(formData.productionCost),
                    )}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {(
                      ((parseFloat(formData.basePrice) -
                        parseFloat(formData.productionCost)) /
                        parseFloat(formData.basePrice)) *
                      100
                    ).toFixed(1)}
                    % margin
                  </p>
                </div>
              )}
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                type='button'
                onClick={handleCancel}
                className='btn-outline'>
                Cancel
              </button>
              <button type='submit' disabled={loading} className='btn-primary'>
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className='card'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='label'>Filter by Category</label>
            <select
              className='input-field'
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value='all'>All Categories</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='label'>Filter by Status</label>
            <select
              className='input-field'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value='all'>All Status</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className='card overflow-hidden p-0'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-bakery-pink text-white'>
                <th className='table-header'>Product Name</th>
                <th className='table-header'>Category</th>
                <th className='table-header'>Selling Price</th>
                <th className='table-header'>Production Cost</th>
                <th className='table-header'>Profit</th>
                <th className='table-header'>Status</th>
                <th className='table-header'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className='table-cell text-center text-gray-500 py-8'>
                    No products found. Add one above.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: any) => {
                  const profit = product.productionCost
                    ? product.basePrice - product.productionCost
                    : null;

                  return (
                    <tr key={product._id} className='hover:bg-gray-50'>
                      <td className='table-cell'>
                        <div className='flex items-center gap-2'>
                          <Package size={16} className='text-bakery-pink' />
                          <span className='font-semibold'>
                            {product.productName}
                          </span>
                        </div>
                      </td>
                      <td className='table-cell'>
                        <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold'>
                          {product.category}
                        </span>
                      </td>
                      <td className='table-cell font-bold text-bakery-pink'>
                        {formatCurrency(product.basePrice)}
                      </td>
                      <td className='table-cell'>
                        {product.productionCost ? (
                          formatCurrency(product.productionCost)
                        ) : (
                          <span className='text-gray-400'>-</span>
                        )}
                      </td>
                      <td className='table-cell'>
                        {profit !== null ? (
                          <span className='font-semibold text-green-600'>
                            {formatCurrency(profit)}
                          </span>
                        ) : (
                          <span className='text-gray-400'>-</span>
                        )}
                      </td>
                      <td className='table-cell'>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className='table-cell'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleEdit(product)}
                            className='text-blue-600 hover:text-blue-800'>
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className='text-red-600 hover:text-red-800'>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
