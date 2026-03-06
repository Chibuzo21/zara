import React from "react";

export default function LoginHeader() {
  return (
    <div className='text-center mb-8'>
      <div className='inline-block p-4 bg-linear-to-br from-bakery-pink to-bakery-gold rounded-full mb-4'>
        <svg
          className='w-16 h-16 text-white'
          fill='currentColor'
          viewBox='0 0 24 24'>
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z' />
        </svg>
      </div>
      <h1 className='text-4xl font-bold bg-linear-to-r from-bakery-pink to-bakery-gold bg-clip-text text-transparent'>
        Zara's Delight
      </h1>
      <p className='text-gray-600 mt-2'>Bakery Management System</p>
    </div>
  );
}
