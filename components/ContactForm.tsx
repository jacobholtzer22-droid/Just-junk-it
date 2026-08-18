"use client";

import { useState } from "react";
import { Phone, Check, Loader2, AlertTriangle } from "lucide-react";
import { site } from "@/site.config";
import { isDemoMode } from "@/lib/require-live-config";
import { fireConversion } from "./Analytics";
import TelLink from "./TelLink";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * CRM CONTRACT — do not add, rename or reorder fields.
 * POST body is EXACTLY { name, phone, email, message, smsConsent, businessSlug }.
 * Spam filtering happens platform-side; do not invent extra keys for it. The honeypot
 * below is checked locally and is NEVER added to the body.
 *
 * DEMO MODE (isDemoMode === true, i.e. crm.businessSlug is empty):
 *   Everything the visitor can see behaves exactly as it will in production —
 *   the same validation, the same honeypot, the same required consent checkbox, the
 *   same loading state, the same success screen. The only difference is that no fetch
 *   is made. There is deliberately NO badge, banner or watermark: the owner is being
 *   shown his website, not a caveat.
 *   A single console warning names this file and the missing slug, for whoever is
 *   looking at devtools.
 *
 * SILENT LEAD LOSS (live mode): the endpoint returns HTTP 200 even when businessSlug
 * matches no Business row. The green success state proves NOTHING about delivery.
 * Before launch, verify the slug against the live Neon row and confirm one real test
 * submission lands as a WebsiteLead in the dashboard.
 */

/** Fires once per page load, not once per keystroke. */
let demoWarned = false;

function warnDemoOnce() {
  if (demoWarned) return;
  demoWarned = true;
  console.warn(
    "[Just Junk It] DEMO MODE — quote form submitted but NOT sent. " +
      "site.config.ts -> crm.businessSlug is an empty string, so there is no CRM " +
      "tenant to post to. See components/ContactForm.tsx and the GO LIVE checklist " +
      "at the top of HANDOFF.md.",
  );
}

export default function ContactForm() {
  const { contact, business, crm } = site;
  const f = contact.form;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [smsConsent, setSmsConsent] = useState(false); // real checkbox, never auto-true
  const [company, setCompany] = useState(""); // honeypot — humans never see this
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState(false);

  const nameOk = name.trim().length > 0;
  const phoneOk = phone.replace(/\D/g, "").length >= 10;
  const consentOk = smsConsent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setTouched(true);
    if (!nameOk || !phoneOk || !consentOk) return;

    // Honeypot. A bot fills every field it finds; a human cannot see this one.
    // Show the normal success screen so the bot learns nothing, and send nothing.
    if (company.trim().length > 0) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    // Address folds into `message` so the CRM body stays the exact contract.
    const fullMessage = address.trim()
      ? `Address or town: ${address.trim()}\n\n${message}`
      : message;

    // DEMO: identical UX, no network write. Live path below is already wired and
    // takes effect the moment crm.businessSlug is non-empty.
    if (isDemoMode) {
      warnDemoOnce();
      await new Promise((r) => setTimeout(r, 700)); // let the loading state register
      setStatus("success");
      return;
    }

    try {
      const res = await fetch(crm.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message: fullMessage,
          smsConsent,
          businessSlug: crm.businessSlug,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      fireConversion(site.ads.conversions.contact);
    } catch {
      setStatus("error"); // keep the user's typed input, never wipe it
    }
  }

  if (status === "success") {
    return (
      <div className="border-2 border-accent/30 bg-surface p-8 text-center sm:p-12">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent text-paper">
          <Check className="h-8 w-8" strokeWidth={3} aria-hidden="true" />
        </span>
        <h2 className="mt-6 font-display text-4xl uppercase tracking-tight text-paper">
          {contact.successHeading}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-paper/70">
          {contact.successBody}
        </p>
        <TelLink className="btn-accent mt-8 px-8 py-4 text-xl">
          <Phone className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          {business.phoneDisplay}
        </TelLink>
      </div>
    );
  }

  const inputClass =
    "w-full min-h-[52px] border-2 border-paper/20 bg-ink px-4 py-3 text-base text-paper " +
    "placeholder:text-paper/35 focus:border-accent focus:outline-none focus:ring-0";
  const labelClass =
    "mb-2 block font-display text-sm uppercase tracking-widest text-paper/80";
  const errClass = "mt-2 flex items-center gap-1.5 text-sm font-semibold text-danger";

  return (
    <form onSubmit={handleSubmit} className="border-2 border-paper/15 bg-surface p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            {f.nameLabel} <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={touched && !nameOk}
            aria-describedby={touched && !nameOk ? "name-err" : undefined}
            className={inputClass}
            placeholder={f.namePlaceholder}
          />
          {touched && !nameOk ? (
            <p id="name-err" role="alert" className={errClass}>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Add your name so we know who to ask for.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            {f.phoneLabel} <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={touched && !phoneOk}
            aria-describedby={touched && !phoneOk ? "phone-err" : undefined}
            className={inputClass}
            placeholder={f.phonePlaceholder}
          />
          {touched && !phoneOk ? (
            <p id="phone-err" role="alert" className={errClass}>
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              A 10 digit phone number, so we can call you back.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            {f.emailLabel}{" "}
            <span className="font-body normal-case tracking-normal text-paper/60">
              {f.emailOptionalLabel}
            </span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder={f.emailPlaceholder}
          />
        </div>
        <div>
          <label htmlFor="address" className={labelClass}>
            {f.addressLabel}{" "}
            <span className="font-body normal-case tracking-normal text-paper/60">
              {f.addressOptionalLabel}
            </span>
          </label>
          <input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
            placeholder={f.addressPlaceholder}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelClass}>
          {f.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y`}
          placeholder={f.messagePlaceholder}
        />
      </div>

      {/*
        Honeypot. Hidden from sighted users, from screen readers (aria-hidden), and from
        the keyboard (tabIndex -1). Never rendered with display:none, which some bots
        detect and skip. Checked locally; never added to the POST body.
      */}
      <div className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="company">Company (leave this field empty)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* TCPA consent. Real checkbox, default unchecked, never pre-ticked, required. */}
      {/* The whole row is the target: the label is bound to the input, so tapping
          anywhere in this 44px-min block toggles it. */}
      <div className="mt-6 flex min-h-[44px] items-start gap-3 py-1">
        <input
          id="smsConsent"
          name="smsConsent"
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          aria-invalid={touched && !consentOk}
          aria-describedby={touched && !consentOk ? "consent-err" : undefined}
          className="h-11 w-11 shrink-0 cursor-pointer accent-accent"
        />
        <label htmlFor="smsConsent" className="cursor-pointer self-center text-sm leading-relaxed text-paper/65">
          {contact.consentLabel}
        </label>
      </div>
      {touched && !consentOk ? (
        <p id="consent-err" role="alert" className={`${errClass} ml-9`}>
          <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          Tick the box so we are allowed to text you back.
        </p>
      ) : null}

      {status === "error" ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 border-2 border-danger/50 bg-danger/10 px-4 py-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <span className="text-[15px] text-paper">
            {contact.errorLead}{" "}
            <TelLink className="font-display text-xl text-accent underline underline-offset-2">
              {business.phoneDisplay}
            </TelLink>
          </span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-accent mt-7 w-full px-8 py-5 text-xl disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {f.submittingLabel}
          </>
        ) : (
          f.submitLabel
        )}
      </button>
    </form>
  );
}
