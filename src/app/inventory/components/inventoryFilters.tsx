import React from "react";
import { InventoryFiltersProps } from "./types";

export default function InventoryFilters({
  categoryFilter,
  setCategoryFilter,
  stockFilter,
  setStockFilter,
}: InventoryFiltersProps) {
  return (
    <div className='card'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='label'>Category</label>
          <select
            className='input-field'
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value='all'>All Categories</option>
            <option value='flour'>Flour</option>
            <option value='sugar'>Sugar</option>
            <option value='dairy'>Dairy</option>
            <option value='eggs'>Eggs</option>
            <option value='flavoring'>Flavoring</option>
            <option value='packaging'>Packaging</option>
            <option value='other'>Other</option>
          </select>
        </div>

        <div>
          <label className='label'>Stock Status</label>
          <select
            className='input-field'
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}>
            <option value='all'>All Items</option>
            <option value='low'>Low Stock</option>
            <option value='out'>Out of Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
}
