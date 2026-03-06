"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Role, Status, StaffFormProps } from "./types";
import { ROLES, STATUSES } from "./staffData";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LivePreview from "./Form-Components/LivePreview";
import { createSchema, editSchema } from "./Form-Components/validation";
import BasicInfo from "./Form-Components/BasicInfo";
import RoleStatus from "./Form-Components/RoleStatus";
import Compensation from "./Form-Components/Compensation";
import Actions from "./Form-Components/Actions";
import { FormValues } from "./Form-Components/validation";
import type { Resolver } from "react-hook-form";

// ─── Helper ───────────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className='sf-field-error'>{message}</p>;
}

export default function StaffForm({
  title,
  text,
  mode,
  staff,
}: StaffFormProps) {
  const router = useRouter();
  const createStaff = useAction(api.staffs.staffMutation.createStaff);
  const editStaff = useAction(api.staffs.staffMutation.editAction);
  const [serverError, setServerError] = useState("");
  const [activeSection, setActiveSection] = useState("basic");
  const schema = useMemo(
    () => (mode === "create" ? createSchema : editSchema),
    [mode],
  );
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onSubmit",
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "sales",
      status: "active",
      dateHired: new Date().toISOString().split("T")[0],
      baseSalary: "",
      commissionRate: "",
    },
  });

  // Populate in edit mode
  useEffect(() => {
    if (mode === "edit" && staff) {
      reset({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, staff]);

  const { role, status } = watch();
  const selectedRole = useMemo(
    () => ROLES.find((r) => r.value === role),
    [role],
  );
  const selectedStatus = useMemo(
    () => STATUSES.find((s) => s.value === status),
    [status],
  );

  const toggle = useCallback(
    (section: string) =>
      setActiveSection((prev) => (prev === section ? "" : section)),
    [],
  );

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const staffInfo = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        role: data.role as Role,
        status: data.status as Status,
        dateHired: data.dateHired,
        password: data.password?.trim() ? data.password : undefined,
        baseSalary: data.baseSalary ? parseFloat(data.baseSalary) : undefined,
        commissionRate: parseFloat(data.commissionRate) || 0,
      };
      setServerError("");
      try {
        if (mode === "create") {
          await createStaff({ ...staffInfo, password: data.password });
        } else {
          await editStaff({
            id: staff!._id,
            ...staffInfo,
          });
        }
        router.push("/staff");
      } catch (err: any) {
        setServerError(err?.message ?? "Something went wrong.");
      }
    },
    [mode, staff, createStaff, editStaff, router],
  );

  return (
    <>
      <div className='sf-root'>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Link href='/staff' className='sf-back'>
            <ArrowLeft size={14} /> Back to Staff
          </Link>

          <div className='sf-header'>
            <div className='sf-badge'>
              {mode === "create" ? "New Record" : "Edit Record"}
            </div>
            <h1 className='sf-title'>{title}</h1>
            <p className='sf-subtitle'>{text}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='sf-layout'>
              <div className='sf-sections'>
                {serverError && <div className='sf-error'>{serverError}</div>}

                {/* ── 01 Basic Information ── */}
                <BasicInfo
                  register={register}
                  mode={mode}
                  FieldError={FieldError}
                  errors={errors}
                  activeSection={activeSection}
                  toggle={toggle}
                />
                {/* ── 02 Role & Status ── */}

                <RoleStatus
                  register={register}
                  toggle={toggle}
                  selectedRole={selectedRole}
                  activeSection={activeSection}
                  control={control}
                  FieldError={FieldError}
                  errors={errors}
                />

                {/* ── 03 Compensation ── */}
                <Compensation
                  selectedRole={selectedRole}
                  activeSection={activeSection}
                  FieldError={FieldError}
                  errors={errors}
                  register={register}
                  toggle={toggle}
                />

                {/* Actions */}
                <Actions mode={mode} isSubmitting={isSubmitting} />
              </div>

              {/* Live Preview */}
              <LivePreview
                formData={watch()}
                selectedRole={selectedRole}
                selectedStatus={selectedStatus}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
