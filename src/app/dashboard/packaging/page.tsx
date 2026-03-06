"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import {
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { useState } from "react";
import { useRoleGuard } from "../../../../hooks/useRoleGuard";

const packaging = api.packaging.packaging;
export default function PackagingDashboardPage() {
  const user = useQuery(api.users.viewer);
  const today = new Date().toISOString().split("T")[0];
  const tasks = useQuery(packaging.getToday) || [];
  const products = useQuery(api.production.products.getAll) || [];
  const createTask = useMutation(packaging.createTask);
  const updateProgress = useMutation(packaging.updateProgress);
  const markComplete = useMutation(packaging.markComplete);
  const deleteTask = useMutation(packaging.deleteTask);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    targetQuantity: "",
    notes: "",
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState("");

  const { isAllowed, isLoading } = useRoleGuard([
    "owner",
    "admin",
    "packaging",
  ]);
  const totalToPack = tasks.reduce(
    (sum: number, task: any) => sum + task.targetQuantity,
    0,
  );
  const totalPacked = tasks.reduce(
    (sum: number, task: any) => sum + task.packedQuantity,
    0,
  );
  const completionRate =
    totalToPack > 0 ? Math.round((totalPacked / totalToPack) * 100) : 0;

  const pendingTasks = tasks.filter((t: any) => t.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (t: any) => t.status === "in_progress",
  ).length;
  const completedTasks = tasks.filter(
    (t: any) => t.status === "completed",
  ).length;

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTask({
        productId: formData.productId as any,
        targetQuantity: parseFloat(formData.targetQuantity),
        taskDate: today,
        assignedTo: user?.staffId as any,
        notes: formData.notes || undefined,
      });

      setFormData({ productId: "", targetQuantity: "", notes: "" });
      setShowForm(false);
    } catch (error) {
      alert("Failed to create task");
    }
  };

  const handleUpdateProgress = async (taskId: string, quantity: number) => {
    try {
      await updateProgress({
        taskId: taskId as any,
        packedQuantity: quantity,
      });
      setEditingTask(null);
      setEditQuantity("");
    } catch (error) {
      alert("Failed to update progress");
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    if (!confirm("Mark this task as complete?")) return;

    try {
      await markComplete({ taskId: taskId as any });
    } catch (error) {
      alert("Failed to mark complete");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;

    try {
      await deleteTask({ taskId: taskId as any });
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  if (isLoading || !isAllowed) return null;
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Packaging Dashboard 📦
          </h1>
          <p className='text-gray-600 mt-1'>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className='btn-primary flex items-center gap-2'>
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <div className='card bg-blue-50 border-2 border-blue-200'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>
            Create Packaging Task
          </h2>
          <form onSubmit={handleCreateTask} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='label'>Product *</label>
                <select
                  className='input-field'
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  required>
                  <option value=''>Select product...</option>
                  {products.map((product: any) => (
                    <option key={product._id} value={product._id}>
                      {product.productName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='label'>Target Quantity *</label>
                <input
                  type='number'
                  className='input-field'
                  placeholder='50'
                  min='1'
                  value={formData.targetQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetQuantity: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='md:col-span-2'>
                <label className='label'>Notes</label>
                <textarea
                  className='input-field'
                  rows={2}
                  placeholder='Any special instructions...'
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                type='button'
                onClick={() => setShowForm(false)}
                className='btn-outline'>
                Cancel
              </button>
              <button type='submit' className='btn-primary'>
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Total to Pack</p>
              <p className='text-3xl font-bold mt-2'>{totalToPack}</p>
              <p className='text-sm mt-1 text-white/80'>items</p>
            </div>
            <Package size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Packed</p>
              <p className='text-3xl font-bold mt-2'>{totalPacked}</p>
              <p className='text-sm mt-1 text-white/80'>
                {completionRate}% done
              </p>
            </div>
            <CheckCircle size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Remaining</p>
              <p className='text-3xl font-bold mt-2'>
                {totalToPack - totalPacked}
              </p>
              <p className='text-sm mt-1 text-white/80'>items left</p>
            </div>
            <Clock size={40} className='text-white/50' />
          </div>
        </div>

        <div className='bg-gradient-to-br from-bakery-pink to-bakery-gold text-white rounded-lg p-6 shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white/80 text-sm'>Tasks</p>
              <p className='text-3xl font-bold mt-2'>{tasks.length}</p>
              <p className='text-sm mt-1 text-white/80'>
                {completedTasks} done
              </p>
            </div>
            <TrendingUp size={40} className='text-white/50' />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalToPack > 0 && (
        <div className='card bg-gradient-to-br from-green-50 to-white border-2 border-green-300'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-xl font-bold text-gray-900'>
              Today's Progress
            </h2>
            <span className='text-2xl font-bold text-green-600'>
              {completionRate}%
            </span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-6'>
            <div
              className='bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center'
              style={{ width: `${completionRate}%` }}>
              {completionRate > 10 && (
                <span className='text-white text-sm font-bold'>
                  {totalPacked} / {totalToPack}
                </span>
              )}
            </div>
          </div>
          <p className='text-sm text-gray-600 mt-2'>
            {totalToPack - totalPacked} items remaining
          </p>
        </div>
      )}

      {/* Tasks List */}
      <div className='card'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>
            Packaging Tasks ({tasks.length})
          </h2>
          <div className='flex gap-2'>
            <span className='px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold'>
              {pendingTasks} Pending
            </span>
            <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold'>
              {inProgressTasks} In Progress
            </span>
            <span className='px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold'>
              {completedTasks} Done
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className='text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
            <Package size={48} className='mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 font-semibold'>
              No packaging tasks for today
            </p>
            <p className='text-gray-500 text-sm mt-2 mb-4'>
              Create your first task to get started
            </p>
            <button
              onClick={() => setShowForm(true)}
              className='btn-primary inline-flex items-center gap-2'>
              <Plus size={16} />
              Create First Task
            </button>
          </div>
        ) : (
          <div className='space-y-3'>
            {tasks.map((task: any) => {
              const progress =
                task.targetQuantity > 0
                  ? Math.round(
                      (task.packedQuantity / task.targetQuantity) * 100,
                    )
                  : 0;

              return (
                <div
                  key={task._id}
                  className='p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-bakery-pink transition-colors'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <h3 className='text-lg font-bold text-gray-900'>
                          {task.product?.productName || "Unknown Product"}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {task.status === "completed"
                            ? "✓ Complete"
                            : task.status === "in_progress"
                              ? "◐ In Progress"
                              : "○ Pending"}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 mt-1'>
                        Target: <strong>{task.targetQuantity}</strong> • Packed:{" "}
                        <strong>{task.packedQuantity}</strong> • Remaining:{" "}
                        <strong>
                          {task.targetQuantity - task.packedQuantity}
                        </strong>
                      </p>
                      {task.notes && (
                        <p className='text-xs text-gray-500 mt-1'>
                          📝 {task.notes}
                        </p>
                      )}
                    </div>
                    <div className='text-right ml-4'>
                      <p className='text-3xl font-bold text-bakery-pink'>
                        {progress}%
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='w-full bg-gray-200 rounded-full h-3 mb-3'>
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        task.status === "completed"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : task.status === "in_progress"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : "bg-gray-300"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Actions */}
                  {task.status !== "completed" && (
                    <div className='flex gap-2'>
                      {editingTask === task._id ? (
                        <>
                          <input
                            type='number'
                            className='input-field flex-1'
                            placeholder={`Packed (max ${task.targetQuantity})`}
                            min='0'
                            max={task.targetQuantity}
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(e.target.value)}
                          />
                          <button
                            onClick={() =>
                              handleUpdateProgress(
                                task._id,
                                parseFloat(editQuantity),
                              )
                            }
                            className='btn-primary'>
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingTask(null);
                              setEditQuantity("");
                            }}
                            className='btn-outline'>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingTask(task._id);
                              setEditQuantity(task.packedQuantity.toString());
                            }}
                            className='btn-secondary text-sm flex-1 flex items-center justify-center gap-2'>
                            <Edit size={16} />
                            Update Progress
                          </button>
                          <button
                            onClick={() => handleMarkComplete(task._id)}
                            className='btn-primary text-sm flex-1'>
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className='btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white'>
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className='card bg-yellow-50 border-2 border-yellow-200'>
        <h3 className='font-bold text-yellow-900 mb-2 flex items-center gap-2'>
          <Package size={20} />
          💡 Packaging Tips
        </h3>
        <ul className='text-sm text-yellow-800 space-y-1 list-disc list-inside'>
          <li>Check product quality before packaging</li>
          <li>Use clean and intact packaging materials</li>
          <li>Label packages with product name and date</li>
          <li>Stack properly to avoid damage</li>
          <li>Follow FIFO (First In, First Out)</li>
        </ul>
      </div>
    </div>
  );
}
