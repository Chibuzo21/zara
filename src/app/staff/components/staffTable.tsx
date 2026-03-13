import { Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";

import React from "react";
import { iTableParams } from "./types";

const tableHeaders = [
  "Name",
  "Role",
  "Status",
  "Contact",
  "Commission Rate",
  "Date Hired",
  "Actions",
];

export default function StaffTable({
  filteredStaff,
  roleColors,
  statusColors,
  handleDelete,
  formatDate,
}: iTableParams) {
  return (
    <div className='rounded-2xl overflow-hidden border border-rose-100 shadow-sm bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-rose-100 bg-rose-50/60'>
              {tableHeaders.map((th, idx) => (
                <th
                  key={idx}
                  className='px-5 py-3.5 text-left text-xs font-semibold tracking-widest uppercase text-rose-400 whitespace-nowrap'>
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {filteredStaff?.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='px-5 py-16 text-center text-gray-400 text-sm'>
                  <div className='flex flex-col items-center gap-2'>
                    <span className='text-3xl'>👤</span>
                    <span>No staff members found</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStaff?.map((member) => (
                <tr
                  key={member._id}
                  className='group transition-colors duration-150 hover:bg-rose-50/40'>
                  {/* Name */}
                  <td className='px-5 py-4'>
                    <span className='font-semibold text-gray-800 group-hover:text-rose-600 transition-colors'>
                      {member.fullName}
                    </span>
                  </td>

                  {/* Role */}
                  <td className='px-5 py-4'>
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase ${roleColors[member.role]}`}>
                      {member.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className='px-5 py-4'>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColors[member.status]}`}>
                      <span className='w-1.5 h-1.5 rounded-full bg-current opacity-70' />
                      {member.status}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className='px-5 py-4'>
                    <div className='flex flex-col gap-0.5'>
                      <span className='text-gray-700 font-medium'>
                        {member.phone || (
                          <span className='text-gray-300 italic'>—</span>
                        )}
                      </span>
                      <span className='text-gray-400 text-xs'>
                        {member.email || <span className='italic'>—</span>}
                      </span>
                    </div>
                  </td>

                  {/* Commission Rate */}
                  <td className='px-5 py-4'>
                    <span className='font-semibold text-rose-500 tabular-nums'>
                      {member.commissionRate}%
                    </span>
                  </td>

                  {/* Date Hired */}
                  <td className='px-5 py-4'>
                    <span className='text-gray-500 tabular-nums'>
                      {formatDate(member.dateHired)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className='px-5 py-4'>
                    <div className='flex items-center gap-1'>
                      <Link
                        href={`/staff/${member._id}`}
                        className='p-2 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-150'
                        title='View'>
                        <Eye size={15} strokeWidth={2} />
                      </Link>

                      <Link
                        href={`/staff/${member._id}/edit`}
                        className='p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150'
                        title='Edit'>
                        <Edit2 size={15} strokeWidth={2} />
                      </Link>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className='p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150'
                        title='Delete'>
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filteredStaff && filteredStaff.length > 0 && (
        <div className='px-5 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between'>
          <span className='text-xs text-gray-400'>
            {filteredStaff.length} member{filteredStaff.length !== 1 ? "s" : ""}
          </span>
          <span className='text-xs text-gray-300'>
            Staff · Last updated now
          </span>
        </div>
      )}
    </div>
  );
}
