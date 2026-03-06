import React from "react";
import { formatCurrency } from "../../../../lib/utils";
import { Edit, Package, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { ProductsTableProps } from "../types";

export default function ProductsTable({
  filteredProducts,
  handleEdit,
  handleDelete,
}: ProductsTableProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .pt-wrap {
          font-family: 'DM Sans', sans-serif;
          background: #fdfaf6;
          border-radius: 20px;
          overflow: hidden;
          border: 1.5px solid #ecdfd0;
          box-shadow: 0 4px 32px rgba(180,120,80,0.07);
        }

        .pt-header-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 0.8fr 0.7fr;
          padding: 14px 28px;
          background: #2b1a0e;
          gap: 12px;
          align-items: center;
        }

        .pt-header-cell {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c9a882;
        }

        .pt-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 0.8fr 0.7fr;
          padding: 18px 28px;
          gap: 12px;
          align-items: center;
          border-bottom: 1px solid #ecdfd0;
          transition: background 0.15s ease;
          position: relative;
        }

        .pt-row:last-child {
          border-bottom: none;
        }

        .pt-row:hover {
          background: #fdf3e8;
        }

        .pt-row:hover .pt-actions {
          opacity: 1;
          transform: translateX(0);
        }

        .pt-product-name {
          font-family: 'DM Serif Display', serif;
          font-size: 15px;
          color: #2b1a0e;
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.2;
        }

        .pt-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f5e6d3, #ecdfd0);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #b06b30;
        }

        .pt-category {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: #f0e8dd;
          color: #7a4a22;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          border: 1px solid #ddd0c0;
        }

        .pt-price {
          font-size: 14px;
          font-weight: 600;
          color: #2b1a0e;
          letter-spacing: -0.01em;
        }

        .pt-cost {
          font-size: 13px;
          color: #9a8070;
          font-weight: 400;
        }

        .pt-profit-pos {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #2d7a4f;
        }

        .pt-profit-neg {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: #c0392b;
        }

        .pt-dash {
          color: #ccc0b4;
          font-size: 13px;
        }

        .pt-badge-active {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: #e6f4ed;
          color: #1e6b40;
          border: 1px solid #b8dfc8;
        }

        .pt-badge-active::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2d9e5f;
        }

        .pt-badge-inactive {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: #f0ede8;
          color: #8a7060;
          border: 1px solid #d8cec4;
        }

        .pt-badge-inactive::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #b0a090;
        }

        .pt-actions {
          display: flex;
          gap: 6px;
          opacity: 0;
          transform: translateX(4px);
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .pt-btn-edit {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1.5px solid #d4c4b0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7a5c40;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .pt-btn-edit:hover {
          background: #2b1a0e;
          border-color: #2b1a0e;
          color: white;
        }

        .pt-btn-delete {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1.5px solid #f0d4d4;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c0392b;
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .pt-btn-delete:hover {
          background: #c0392b;
          border-color: #c0392b;
          color: white;
        }

        .pt-empty {
          padding: 64px 28px;
          text-align: center;
        }

        .pt-empty-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #f0e8dd;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #b06b30;
        }

        .pt-empty-title {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #2b1a0e;
          margin-bottom: 6px;
        }

        .pt-empty-sub {
          font-size: 13px;
          color: #9a8070;
        }

        .pt-footer {
          padding: 12px 28px;
          background: #f7f0e8;
          border-top: 1px solid #ecdfd0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pt-count {
          font-size: 12px;
          color: #9a8070;
          font-weight: 500;
        }

        .pt-count strong {
          color: #2b1a0e;
        }
      `}</style>

      <div className='pt-wrap'>
        {/* Header */}
        <div className='pt-header-row'>
          <span className='pt-header-cell'>Product</span>
          <span className='pt-header-cell'>Category</span>
          <span className='pt-header-cell'>Selling Price</span>
          <span className='pt-header-cell'>Prod. Cost</span>
          <span className='pt-header-cell'>Profit</span>
          <span className='pt-header-cell'>Status</span>
          <span className='pt-header-cell'>Actions</span>
        </div>

        {/* Body */}
        {filteredProducts.length === 0 ? (
          <div className='pt-empty'>
            <div className='pt-empty-icon'>
              <Package size={24} />
            </div>
            <p className='pt-empty-title'>No products found</p>
            <p className='pt-empty-sub'>Add a product to get started.</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const profit =
              product.productionCost != null
                ? product.basePrice - product.productionCost
                : null;

            return (
              <div key={product._id} className='pt-row'>
                {/* Name */}
                <div className='pt-product-name'>
                  <div className='pt-icon-wrap'>
                    <Package size={14} />
                  </div>
                  {product.productName}
                </div>

                {/* Category */}
                <div>
                  <span className='pt-category'>{product.category}</span>
                </div>

                {/* Selling Price */}
                <div className='pt-price'>
                  {formatCurrency(product.basePrice)}
                </div>

                {/* Production Cost */}
                <div>
                  {product.productionCost != null ? (
                    <span className='pt-cost'>
                      {formatCurrency(product.productionCost)}
                    </span>
                  ) : (
                    <span className='pt-dash'>—</span>
                  )}
                </div>

                {/* Profit */}
                <div>
                  {profit !== null ? (
                    profit >= 0 ? (
                      <span className='pt-profit-pos'>
                        <TrendingUp size={13} />
                        {formatCurrency(profit)}
                      </span>
                    ) : (
                      <span className='pt-profit-neg'>
                        <TrendingDown size={13} />
                        {formatCurrency(profit)}
                      </span>
                    )
                  ) : (
                    <span className='pt-dash'>—</span>
                  )}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={
                      product.status === "active"
                        ? "pt-badge-active"
                        : "pt-badge-inactive"
                    }>
                    {product.status}
                  </span>
                </div>

                {/* Actions */}
                <div className='pt-actions'>
                  <button
                    className='pt-btn-edit'
                    onClick={() => handleEdit(product)}
                    title='Edit'>
                    <Edit size={13} />
                  </button>
                  <button
                    className='pt-btn-delete'
                    onClick={() => handleDelete(product._id)}
                    title='Delete'>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Footer */}
        {filteredProducts.length > 0 && (
          <div className='pt-footer'>
            <span className='pt-count'>
              Showing <strong>{filteredProducts.length}</strong>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
