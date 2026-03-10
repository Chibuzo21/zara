"use client";

import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function SetupOwner() {
  const createOwner = useAction(api.auth.createOwner);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = async () => {
    // e.preventDefault();
    try {
      await createOwner({ email, fullName: name, password });
      alert("Owner created successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='p-10 max-w-md mx-auto bg-blue-500'>
      <h1 className='text-2xl font-bold mb-4'>Create Owner</h1>
      <form onSubmit={handleCreate} action=''>
        <input
          placeholder='Name'
          className='border p-2 mb-3 w-full'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder='Email'
          className='border p-2 mb-3 w-full'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder='Password'
          type='password'
          className='border p-2 mb-3 w-full'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded'>
          Create Owner
        </button>
      </form>
    </div>
  );
}
