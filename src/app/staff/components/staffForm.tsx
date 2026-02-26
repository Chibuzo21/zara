"use client";

import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import type { Role, Status, StaffFormProps } from "./types";
import { ROLES, STATUSES } from "./staffData";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

export default function StaffForm({
  title,
  text,
  mode,
  staff,
}: StaffFormProps) {
  const router = useRouter();
  const createStaff = useAction(api.staffs.staffMutation.createStaff);
  const editStaff = useAction(api.staffs.staffMutation.editAction);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "sales" as Role,
    status: "active" as Status,
    dateHired: new Date().toISOString().split("T")[0],
    baseSalary: "",
    commissionRate: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>("basic");

  useEffect(() => {
    if (mode === "edit" && staff) {
      setFormData({
        fullName: staff.fullName,
        email: staff.email ?? "",
        phone: staff.phone ?? "",
        password: "",
        role: staff.role,
        status: staff.status,
        dateHired: staff.dateHired,
        baseSalary: staff.baseSalary?.toString() ?? "",
        commissionRate: staff.commissionRate.toString(),
      });
    }
  }, [mode, staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        await createStaff({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone || undefined,
          role: formData.role,
          status: formData.status,
          dateHired: formData.dateHired,
          password: formData.password,
          baseSalary: formData.baseSalary
            ? parseFloat(formData.baseSalary)
            : undefined,
          commissionRate: parseFloat(formData.commissionRate) || 0,
        });
      } else {
        await editStaff({
          id: staff!._id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          dateHired: formData.dateHired,
          password:
            formData.password.trim() !== "" ? formData.password : undefined,
          baseSalary: formData.baseSalary
            ? parseFloat(formData.baseSalary)
            : undefined,
          commissionRate: parseFloat(formData.commissionRate) || 0,
        });
      }
      router.push("/staff");
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedRole = ROLES.find((r) => r.value === formData.role);
  const selectedStatus = STATUSES.find((s) => s.value === formData.status);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .sf-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #0f0f11;
          color: #e8e4dc;
          padding: 2rem 1rem 4rem;
        }

        .sf-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b6b70;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          transition: color 0.2s;
          margin-bottom: 2.5rem;
        }
        .sf-back:hover { color: #e8e4dc; }

        .sf-header {
          margin-bottom: 3rem;
        }
        .sf-badge {
          display: inline-block;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          color: #d4a853;
          border: 1px solid #d4a85340;
          border-radius: 2px;
          padding: 0.2rem 0.6rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        .sf-title {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #f0ece4;
          margin: 0 0 0.5rem;
        }
        .sf-subtitle {
          color: #6b6b70;
          font-size: 0.9rem;
          font-weight: 400;
        }

        .sf-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
          max-width: 960px;
        }
        @media (max-width: 768px) {
          .sf-layout { grid-template-columns: 1fr; }
        }

        .sf-sections { display: flex; flex-direction: column; gap: 1rem; }

        .sf-section {
          border: 1px solid #1e1e24;
          border-radius: 12px;
          overflow: hidden;
          background: #13131a;
          transition: border-color 0.2s;
        }
        .sf-section.open { border-color: #2a2a35; }

        .sf-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.4rem;
          cursor: pointer;
          user-select: none;
        }
        .sf-section-header:hover .sf-section-label { color: #f0ece4; }

        .sf-section-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sf-section-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          color: #3d3d48;
          width: 22px;
          text-align: right;
        }
        .sf-section-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #8888a0;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .sf-section.open .sf-section-label { color: #d4a853; }

        .sf-chevron {
          color: #3d3d48;
          transition: transform 0.25s, color 0.2s;
        }
        .sf-section.open .sf-chevron {
          transform: rotate(180deg);
          color: #d4a853;
        }

        .sf-section-body {
          padding: 0 1.4rem 1.4rem;
          display: grid;
          gap: 1rem;
        }
        .sf-grid-2 { grid-template-columns: 1fr 1fr; }
        @media (max-width: 520px) { .sf-grid-2 { grid-template-columns: 1fr; } }

        .sf-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .sf-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #5a5a6a;
        }
        .sf-label span { color: #d4a853; margin-left: 2px; }

        .sf-input, .sf-select {
          background: #0c0c12;
          border: 1px solid #1e1e28;
          border-radius: 8px;
          color: #e8e4dc;
          font-family: 'Sora', sans-serif;
          font-size: 0.9rem;
          padding: 0.65rem 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .sf-input::placeholder { color: #3a3a48; }
        .sf-input:focus, .sf-select:focus {
          border-color: #d4a85360;
          box-shadow: 0 0 0 3px #d4a85312;
        }
        .sf-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5a6a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.9rem center;
          padding-right: 2.2rem;
          cursor: pointer;
        }
        .sf-select option { background: #13131a; }

        .sf-input-wrap { position: relative; }
        .sf-input-wrap .sf-input { padding-right: 2.8rem; }
        .sf-eye {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #5a5a6a;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .sf-eye:hover { color: #d4a853; }

        .sf-hint {
          font-size: 0.72rem;
          color: #3d3d48;
          line-height: 1.4;
        }
        .sf-hint.gold { color: #9a7a3a; }

        /* Role pills */
        .sf-role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        @media (max-width: 520px) { .sf-role-grid { grid-template-columns: repeat(2, 1fr); } }

        .sf-role-pill {
          border: 1px solid #1e1e28;
          border-radius: 8px;
          padding: 0.6rem 0.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s;
          background: #0c0c12;
        }
        .sf-role-pill:hover { border-color: #3a3a48; }
        .sf-role-pill.active {
          background: #1a1a22;
        }
        .sf-role-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin: 0 auto 0.4rem;
          opacity: 0.5;
          transition: opacity 0.15s;
        }
        .sf-role-pill.active .sf-role-pill-dot { opacity: 1; }
        .sf-role-pill-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: #5a5a6a;
          letter-spacing: 0.03em;
          transition: color 0.15s;
        }
        .sf-role-pill.active .sf-role-pill-name { color: #e8e4dc; }

        /* Status pills */
        .sf-status-row {
          display: flex;
          gap: 0.5rem;
        }
        .sf-status-pill {
          flex: 1;
          border: 1px solid #1e1e28;
          border-radius: 8px;
          padding: 0.55rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s;
          background: #0c0c12;
          font-size: 0.75rem;
          font-weight: 600;
          color: #5a5a6a;
          letter-spacing: 0.03em;
        }
        .sf-status-pill:hover { border-color: #3a3a48; }
        .sf-status-pill.active { background: #1a1a22; }

        /* Preview card */
        .sf-preview {
          border: 1px solid #1e1e24;
          border-radius: 12px;
          background: #13131a;
          padding: 1.4rem;
          position: sticky;
          top: 1.5rem;
          height: fit-content;
        }
        .sf-preview-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3d3d48;
          margin-bottom: 1.2rem;
        }
        .sf-preview-avatar {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .sf-preview-name {
          font-size: 1.05rem;
          font-weight: 600;
          color: #f0ece4;
          margin-bottom: 0.2rem;
          min-height: 1.4em;
        }
        .sf-preview-email {
          font-size: 0.78rem;
          color: #5a5a6a;
          margin-bottom: 1.2rem;
          min-height: 1.2em;
          word-break: break-all;
        }
        .sf-preview-divider {
          height: 1px;
          background: #1e1e28;
          margin: 1rem 0;
        }
        .sf-preview-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.65rem;
        }
        .sf-preview-key {
          font-size: 0.7rem;
          color: #3d3d48;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .sf-preview-val {
          font-size: 0.8rem;
          font-weight: 500;
          color: #8888a0;
        }
        .sf-preview-status {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 20px;
        }
        .sf-preview-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        /* Error */
        .sf-error {
          background: #1f0e0e;
          border: 1px solid #ef444430;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          color: #f87171;
          margin-bottom: 1rem;
        }

        /* Actions */
        .sf-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }
        .sf-btn-cancel {
          padding: 0.7rem 1.3rem;
          border: 1px solid #2a2a35;
          border-radius: 8px;
          background: transparent;
          color: #6b6b70;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.15s;
        }
        .sf-btn-cancel:hover { color: #e8e4dc; border-color: #3a3a48; }

        .sf-btn-submit {
          padding: 0.7rem 1.4rem;
          border: none;
          border-radius: 8px;
          background: #d4a853;
          color: #0f0f11;
          font-family: 'Sora', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .sf-btn-submit:hover { background: #e0b860; transform: translateY(-1px); }
        .sf-btn-submit:active { transform: translateY(0); }
        .sf-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div className='sf-root'>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Link href='/staff' className='sf-back'>
            <ArrowLeft size={14} />
            Back to Staff
          </Link>

          <div className='sf-header'>
            <div className='sf-badge'>
              {mode === "create" ? "New Record" : "Edit Record"}
            </div>
            <h1 className='sf-title'>{title}</h1>
            <p className='sf-subtitle'>{text}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='sf-layout'>
              {/* Left: sections */}
              <div className='sf-sections'>
                {error && <div className='sf-error'>{error}</div>}

                {/* Section 1: Basic Info */}
                <div
                  className={`sf-section ${activeSection === "basic" ? "open" : ""}`}>
                  <div
                    className='sf-section-header'
                    onClick={() =>
                      setActiveSection(
                        activeSection === "basic" ? null : "basic",
                      )
                    }>
                    <div className='sf-section-left'>
                      <span className='sf-section-num'>01</span>
                      <span className='sf-section-label'>
                        Basic Information
                      </span>
                    </div>
                    <ChevronDown size={16} className='sf-chevron' />
                  </div>
                  {activeSection === "basic" && (
                    <div className='sf-section-body sf-grid-2'>
                      <div className='sf-field'>
                        <label className='sf-label'>
                          Full Name <span>*</span>
                        </label>
                        <input
                          className='sf-input'
                          type='text'
                          name='fullName'
                          placeholder='Ada Okafor'
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className='sf-field'>
                        <label className='sf-label'>
                          Email <span>*</span>
                        </label>
                        <input
                          className='sf-input'
                          type='email'
                          name='email'
                          placeholder='ada@example.com'
                          value={formData.email}
                          onChange={handleChange}
                          required={mode === "create"}
                        />
                      </div>
                      <div className='sf-field'>
                        <label className='sf-label'>Phone</label>
                        <input
                          className='sf-input'
                          type='tel'
                          name='phone'
                          placeholder='08012345678'
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <span className='sf-hint'>Optional</span>
                      </div>
                      <div className='sf-field'>
                        <label className='sf-label'>
                          Password {mode === "create" && <span>*</span>}
                        </label>
                        <div className='sf-input-wrap'>
                          <input
                            className='sf-input'
                            type={showPassword ? "text" : "password"}
                            name='password'
                            placeholder={
                              mode === "edit"
                                ? "Leave blank to keep"
                                : "Min. 8 characters"
                            }
                            value={formData.password}
                            onChange={handleChange}
                            required={mode === "create"}
                          />
                          <button
                            type='button'
                            className='sf-eye'
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>
                        </div>
                        {mode === "edit" && (
                          <span className='sf-hint'>
                            Leave blank to keep current password
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Role & Status */}
                <div
                  className={`sf-section ${activeSection === "role" ? "open" : ""}`}>
                  <div
                    className='sf-section-header'
                    onClick={() =>
                      setActiveSection(activeSection === "role" ? null : "role")
                    }>
                    <div className='sf-section-left'>
                      <span className='sf-section-num'>02</span>
                      <span className='sf-section-label'>Role & Status</span>
                    </div>
                    <ChevronDown size={16} className='sf-chevron' />
                  </div>
                  {activeSection === "role" && (
                    <div className='sf-section-body'>
                      <div className='sf-field'>
                        <label className='sf-label'>
                          Role <span>*</span>
                        </label>
                        <div className='sf-role-grid'>
                          {ROLES.map((r) => (
                            <div
                              key={r.value}
                              className={`sf-role-pill ${formData.role === r.value ? "active" : ""}`}
                              style={{
                                borderColor:
                                  formData.role === r.value
                                    ? r.color + "40"
                                    : "",
                              }}
                              onClick={() =>
                                setFormData({ ...formData, role: r.value })
                              }>
                              <div
                                className='sf-role-pill-dot'
                                style={{ background: r.color }}
                              />
                              <div className='sf-role-pill-name'>{r.label}</div>
                            </div>
                          ))}
                        </div>
                        {selectedRole && (
                          <span className='sf-hint gold'>
                            💡 Commission: {selectedRole.commission}
                          </span>
                        )}
                      </div>
                      <div className='sf-field'>
                        <label className='sf-label'>
                          Status <span>*</span>
                        </label>
                        <div className='sf-status-row'>
                          {STATUSES.map((s) => (
                            <div
                              key={s.value}
                              className={`sf-status-pill ${formData.status === s.value ? "active" : ""}`}
                              style={{
                                borderColor:
                                  formData.status === s.value
                                    ? s.color + "50"
                                    : "",
                                color:
                                  formData.status === s.value ? s.color : "",
                              }}
                              onClick={() =>
                                setFormData({ ...formData, status: s.value })
                              }>
                              {s.label}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='sf-field'>
                        <label className='sf-label'>
                          Date Hired <span>*</span>
                        </label>
                        <input
                          className='sf-input'
                          type='date'
                          name='dateHired'
                          value={formData.dateHired}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Compensation */}
                <div
                  className={`sf-section ${activeSection === "comp" ? "open" : ""}`}>
                  <div
                    className='sf-section-header'
                    onClick={() =>
                      setActiveSection(activeSection === "comp" ? null : "comp")
                    }>
                    <div className='sf-section-left'>
                      <span className='sf-section-num'>03</span>
                      <span className='sf-section-label'>Compensation</span>
                    </div>
                    <ChevronDown size={16} className='sf-chevron' />
                  </div>
                  {activeSection === "comp" && (
                    <div className='sf-section-body sf-grid-2'>
                      <div className='sf-field'>
                        <label className='sf-label'>Base Salary (₦)</label>
                        <input
                          className='sf-input'
                          type='number'
                          name='baseSalary'
                          placeholder='50000'
                          step='0.01'
                          value={formData.baseSalary}
                          onChange={handleChange}
                        />
                        <span className='sf-hint'>Monthly base, optional</span>
                      </div>
                      <div className='sf-field'>
                        <label className='sf-label'>
                          Commission Rate (%) <span>*</span>
                        </label>
                        <input
                          className='sf-input'
                          type='number'
                          name='commissionRate'
                          placeholder='5.0'
                          step='0.1'
                          min='0'
                          max='100'
                          value={formData.commissionRate}
                          onChange={handleChange}
                          required
                        />
                        {selectedRole && (
                          <span className='sf-hint gold'>
                            Suggested: {selectedRole.commission}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className='sf-actions'>
                  <Link href='/staff' className='sf-btn-cancel'>
                    Cancel
                  </Link>
                  <button
                    type='submit'
                    disabled={loading}
                    className='sf-btn-submit'>
                    {loading ? (
                      <>
                        <Loader2
                          size={15}
                          style={{ animation: "spin 1s linear infinite" }}
                        />{" "}
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={15} />{" "}
                        {mode === "create" ? "Create Staff" : "Save Changes"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right: preview */}
              <div className='sf-preview'>
                <div className='sf-preview-title'>// Live Preview</div>
                <div
                  className='sf-preview-avatar'
                  style={{
                    background: (selectedRole?.color ?? "#d4a853") + "18",
                    color: selectedRole?.color ?? "#d4a853",
                  }}>
                  {formData.fullName
                    ? formData.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                    : "?"}
                </div>
                <div className='sf-preview-name'>
                  {formData.fullName || "Full Name"}
                </div>
                <div className='sf-preview-email'>
                  {formData.email || "email@example.com"}
                </div>

                <div className='sf-preview-divider' />

                <div className='sf-preview-row'>
                  <span className='sf-preview-key'>Role</span>
                  <span
                    className='sf-preview-val'
                    style={{ color: selectedRole?.color ?? "#8888a0" }}>
                    {selectedRole?.label ?? "—"}
                  </span>
                </div>
                <div className='sf-preview-row'>
                  <span className='sf-preview-key'>Status</span>
                  <span
                    className='sf-preview-status'
                    style={{
                      background: (selectedStatus?.color ?? "#6b7280") + "18",
                      color: selectedStatus?.color ?? "#6b7280",
                    }}>
                    <span
                      className='sf-preview-status-dot'
                      style={{ background: selectedStatus?.color ?? "#6b7280" }}
                    />
                    {selectedStatus?.label ?? "—"}
                  </span>
                </div>
                <div className='sf-preview-row'>
                  <span className='sf-preview-key'>Hired</span>
                  <span className='sf-preview-val'>
                    {formData.dateHired || "—"}
                  </span>
                </div>
                <div className='sf-preview-row'>
                  <span className='sf-preview-key'>Commission</span>
                  <span className='sf-preview-val' style={{ color: "#d4a853" }}>
                    {formData.commissionRate
                      ? `${formData.commissionRate}%`
                      : "—"}
                  </span>
                </div>
                {formData.baseSalary && (
                  <div className='sf-preview-row'>
                    <span className='sf-preview-key'>Base Salary</span>
                    <span className='sf-preview-val'>
                      ₦{parseFloat(formData.baseSalary).toLocaleString()}
                    </span>
                  </div>
                )}
                {formData.phone && (
                  <div className='sf-preview-row'>
                    <span className='sf-preview-key'>Phone</span>
                    <span className='sf-preview-val'>{formData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
