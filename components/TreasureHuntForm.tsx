"use client";

import React, { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { addTreasureHuntRegistration } from "@/lib/firestore";
import SuccessModal from "./SuccessModal";

const schema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters").max(50),
  teamLeadName: z.string().min(2, "Name must be at least 2 characters").max(60),
  teamLeadUSN: z
    .string()
    .min(3, "USN is required")
    .max(20, "USN too long")
    .regex(/^[a-zA-Z0-9]+$/, "USN should contain only letters and numbers"),
  teamLeadPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  participant1: z.string().min(2, "Participant name required").max(60),
  participant2: z.string().min(2, "Participant name required").max(60),
  participant3: z.string().min(2, "Participant name required").max(60),
  participant4: z.string().min(2, "Participant name required").max(60),
});

type FormValues = z.infer<typeof schema>;

const InputField = forwardRef<
  HTMLInputElement,
  {
    id: string;
    label: string;
    placeholder?: string;
    error?: string;
    prefix?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ id, label, error, prefix, ...rest }, ref) => {
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
            ref={ref}
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
});
InputField.displayName = "InputField";

export default function TreasureHuntForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successTeam, setSuccessTeam] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setSubmitError("");

    const result = await addTreasureHuntRegistration({
      teamName: data.teamName,
      teamLeadName: data.teamLeadName,
      teamLeadUSN: data.teamLeadUSN,
      teamLeadPhone: `+91${data.teamLeadPhone}`,
      participants: [
        data.participant1,
        data.participant2,
        data.participant3,
        data.participant4,
      ],
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
        id="treasure-hunt"
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
                Treasure Hunt
              </h2>
              <div className="gold-line mt-4" style={{ width: 80 }} />
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
                id="treasure-hunt-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-7"
                noValidate
              >
                {/* Team Info */}
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
                      Team Information
                    </p>
                    <hr className="flex-1 border-t" style={{ borderColor: "rgba(212,175,55,0.3)" }} />
                  </div>
                  <div className="flex flex-col gap-6">
                    <InputField
                      id="th-teamName"
                      label="Team Name"
                      error={errors.teamName?.message}
                      {...register("teamName")}
                    />
                    <InputField
                      id="th-teamLeadName"
                      label="Team Lead Name"
                      error={errors.teamLeadName?.message}
                      {...register("teamLeadName")}
                    />
                    <InputField
                      id="th-teamLeadUSN"
                      label="Team Lead USN"
                      error={errors.teamLeadUSN?.message}
                      {...register("teamLeadUSN")}
                    />
                    <InputField
                      id="th-teamLeadPhone"
                      label="Team Lead Phone"
                      prefix="+91"
                      type="tel"
                      maxLength={10}
                      inputMode="numeric"
                      error={errors.teamLeadPhone?.message}
                      {...register("teamLeadPhone")}
                    />
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <div className="flex items-center gap-4 mb-4 mt-6">
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
                      Participants (4 Members)
                    </p>
                    <hr className="flex-1 border-t" style={{ borderColor: "rgba(212,175,55,0.3)" }} />
                  </div>
                  <div className="flex flex-col gap-6">
                    {[1, 2, 3, 4].map((n) => (
                      <InputField
                        key={n}
                        id={`th-participant${n}`}
                        label={`Participant ${n} — Full Name`}
                        error={errors[`participant${n}` as keyof FormValues]?.message}
                        {...register(`participant${n}` as keyof FormValues)}
                      />
                    ))}
                  </div>
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
                  id="th-submit"
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
                    "Register for Treasure Hunt"
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
        eventName="Treasure Hunt"
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
