"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { addViralSelfieRegistration } from "@/lib/firestore";
import SuccessModal from "./SuccessModal";

const schema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters").max(50),
  teamLeadName: z.string().min(2, "Name must be at least 2 characters").max(60),
  teamLeadUSN: z
    .string()
    .min(3, "USN is required")
    .max(20)
    .regex(/^[a-zA-Z0-9]+$/, "USN should contain only letters and numbers"),
  teamLeadPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  participants: z.array(
    z.object({
      name: z.string().min(2, "Name must be at least 2 characters").max(60),
    })
  ),
});

type FormValues = z.infer<typeof schema>;

function InputField({
  id,
  label,
  error,
  prefix,
  ...rest
}: {
  id: string;
  label: string;
  placeholder?: string;
  error?: string;
  prefix?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="form-group-floating flex items-center">
        {prefix && (
          <span
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "1rem",
              color: "var(--gold)",
              paddingBottom: 8,
              paddingRight: 4,
              borderBottom: "1px solid rgba(212,175,55,0.3)",
            }}
          >
            {prefix}
          </span>
        )}
        <div className="relative flex-1">
          <input
            id={id}
            placeholder=" "
            className={`input-floating ${error ? "input-error" : ""}`}
            {...rest}
          />
          <label htmlFor={id} className="label-floating">
            {label}
          </label>
        </div>
      </div>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default function ViralSelfieForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successTeam, setSuccessTeam] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { participants: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setSubmitError("");

    const result = await addViralSelfieRegistration({
      teamName: data.teamName,
      teamLeadName: data.teamLeadName,
      teamLeadUSN: data.teamLeadUSN,
      teamLeadPhone: `+91${data.teamLeadPhone}`,
      participants: data.participants.map((p) => p.name),
    });

    setSubmitting(false);

    if (result.success) {
      setSuccessTeam(data.teamName);
      setShowModal(true);
      reset();
    } else {
      setSubmitError(result.error || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <section
        id="viral-selfie"
        className="section-padding relative"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <div className="mb-10">
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.65rem",
                  color: "var(--gold)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Event Registration
              </p>
              <h2
                className="font-display gold-text"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 600,
                }}
              >
                SMVITM Viral Selfie
              </h2>
              <div className="gold-line mt-4" style={{ width: 80 }} />
            </div>

            {/* Info note */}
            <div
              style={{
                marginBottom: 24,
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: 10,
                padding: "12px 16px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-space-mono)",
                  fontSize: "0.68rem",
                  color: "var(--gold-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                📷 Individual or Group — You can add as many members as you like below. Leave empty for a solo entry.
              </p>
            </div>

            {/* Form Card */}
            <div
              className="p-8 md:p-12"
              style={{
                background: "linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.95) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(212,175,55,0.25)",
                borderTop: "3px solid var(--gold)",
                borderRadius: "4px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1)",
              }}
            >
              <form
                id="viral-selfie-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-7"
                noValidate
              >
                {/* Team / Lead Info */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <p
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "10px",
                        color: "var(--gold)",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Lead / Entry Information
                    </p>
                    <hr className="flex-1 border-t" style={{ borderColor: "rgba(212,175,55,0.3)" }} />
                  </div>
                  <div className="flex flex-col gap-6">
                    <InputField
                      id="vs-teamName"
                      label="Team Name / Entry Reference"
                      error={errors.teamName?.message}
                      {...register("teamName")}
                    />
                    <InputField
                      id="vs-teamLeadName"
                      label="Lead Participant Name"
                      error={errors.teamLeadName?.message}
                      {...register("teamLeadName")}
                    />
                    <InputField
                      id="vs-teamLeadUSN"
                      label="Lead USN"
                      error={errors.teamLeadUSN?.message}
                      {...register("teamLeadUSN")}
                    />
                    <InputField
                      id="vs-teamLeadPhone"
                      label="Lead Phone"
                      prefix="+91"
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      error={errors.teamLeadPhone?.message}
                      {...register("teamLeadPhone")}
                    />
                  </div>
                </div>

                {/* Dynamic Participants */}
                <div>
                  <div className="flex items-center justify-between mb-4 mt-6 gap-4">
                    <p
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "10px",
                        color: "var(--gold)",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Group Members (Optional)
                    </p>
                    <hr className="flex-1 border-t" style={{ borderColor: "rgba(212,175,55,0.3)" }} />
                    <button
                      type="button"
                      id="vs-add-member"
                      onClick={() => append({ name: "" })}
                      className="btn-ghost-gold px-4 py-1.5 rounded text-[10px]"
                    >
                      + ADD MEMBER
                    </button>
                  </div>

                  <AnimatePresence>
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-end gap-3 mb-5"
                      >
                        <div className="flex-1">
                          <InputField
                            id={`vs-member-${index}`}
                            label={`Member ${index + 1}`}
                            error={errors.participants?.[index]?.name?.message}
                            {...register(`participants.${index}.name`)}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          title="Remove member"
                          style={{
                            color: "rgba(229,115,115,0.7)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            paddingBottom: 12,
                            fontSize: "1.1rem",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#e57373")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(229,115,115,0.7)")}
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {fields.length === 0 && (
                    <p
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "0.65rem",
                        color: "rgba(255,255,255,0.2)",
                        textAlign: "center",
                        padding: "16px 0",
                        letterSpacing: "0.08em",
                      }}
                    >
                      No group members added — registering as individual
                    </p>
                  )}
                </div>

                {/* Error */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "rgba(229, 115, 115, 0.1)",
                      border: "1px solid rgba(229, 115, 115, 0.3)",
                      borderRadius: 8,
                      padding: "12px 16px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-space-mono)",
                        fontSize: "0.72rem",
                        color: "#e57373",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ⚠ {submitError}
                    </p>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  id="vs-submit"
                  type="submit"
                  disabled={submitting}
                  className="submit-btn-new mt-8"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="spinner" />
                      REGISTERING
                    </span>
                  ) : (
                    "Register for Viral Selfie"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <SuccessModal
        isOpen={showModal}
        teamName={successTeam}
        eventName="SMVITM Viral Selfie"
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
