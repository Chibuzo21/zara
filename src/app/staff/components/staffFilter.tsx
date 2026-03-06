import { Search } from "lucide-react";
import React from "react";
import { iFilter } from "./types";

export default function StaffFilter({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: iFilter) {
  return (
    <div className='card'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='label'>Search</label>
          <div className='relative'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={20}
            />
            <input
              type='text'
              placeholder='Search by name or ID...'
              className='input-field pl-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className='label'>Role</label>
          <select
            className='input-field'
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}>
            <option value='all'>All Roles</option>
            <option value='production'>Production</option>
            <option value='packaging'>Packaging</option>
            <option value='sales'>Sales</option>
            <option value='admin'>Admin</option>
            <option value='owner'>Owner</option>
          </select>
        </div>

        <div>
          <label className='label'>Status</label>
          <select
            className='input-field'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value='all'>All Status</option>
            <option value='active'>Active</option>
            <option value='inactive'>Inactive</option>
            <option value='suspended'>Suspended</option>
          </select>
        </div>
      </div>
    </div>
  );
}
