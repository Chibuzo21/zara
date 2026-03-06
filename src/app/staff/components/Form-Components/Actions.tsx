import { Link, Loader2, Save } from "lucide-react";
import React from "react";

interface iActionParams {
  isSubmitting: boolean;
  mode: "edit" | "create";
}
export default function Actions({ isSubmitting, mode }: iActionParams) {
  return (
    <div className='sf-actions'>
      <Link href='/staff' className='sf-btn-cancel'>
        Cancel
      </Link>
      <button type='submit' disabled={isSubmitting} className='sf-btn-submit'>
        {isSubmitting ? (
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
  );
}
