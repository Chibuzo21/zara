import React from "react";
import { FiltersProps } from "./types";

export default function Filters({ dateFilter, setDateFilter }: FiltersProps) {
  return (
    <div className='card'>
      <div className='flex gap-4 items-end'>
        <div className='flex-1'>
          <label className='label'>Filter by Date</label>
          <input
            type='date'
            className='input-field'
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        {dateFilter && (
          <button onClick={() => setDateFilter("")} className='btn-outline'>
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
}
