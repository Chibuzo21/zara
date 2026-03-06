import React from "react";
import { FiltersProps } from "../types";

export default function Filters({
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  categories,
}: FiltersProps) {
  return (
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
  );
}
