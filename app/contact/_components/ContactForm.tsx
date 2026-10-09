"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import {
  CheckCircle2,
  Send,
  AlertCircle,
} from "lucide-react";

export type StakeholderType =
  | "Farmer"
  | "Buyer"
  | "Investor"
  | "Partner"
  | "Job seeker";

type ContactFormProps = {
  initialStakeholderType?: StakeholderType;
};

const inputClassName =
  "w-full rounded-xl border border-primary-darker/20 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

export default function ContactForm({
  initialStakeholderType = "Farmer",
}: ContactFormProps) {
  const [stakeholderType, setStakeholderType] = useState<StakeholderType>(
    initialStakeholderType,
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    locationState: "Lagos",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim()) {
      setErrorMessage("Please provide your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please provide a valid work or personal email address.");
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage(
        "Please provide a brief message describing your value chain or inquiry (at least 10 characters).",
      );
      return;
    }

    setIsSubmitting(true);
    // Preview-only submit until a backend endpoint is wired.
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 450);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      locationState: "Lagos",
      message: "",
    });
    setIsSuccess(false);
    setErrorMessage("");
  };

  return (
    <div className="rounded-3xl border border-primary-darker/10 bg-card p-8 shadow-sm sm:p-10 lg:col-span-7">
      {isSuccess ? (
        <div className="animate-[hero-enter_300ms_ease-in-out] space-y-5 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-surface text-primary-darker">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-2">
            <h3 className="font-sans text-2xl font-bold text-primary-darker">
              Inquiry preview complete
            </h3>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
              Thanks, <strong>{formData.fullName}</strong>. This is a preview
              form; your <strong>{stakeholderType}</strong> inquiry has not been
              sent.
            </p>
          </div>

          <div className="mx-auto max-w-md space-y-1 rounded-2xl border border-primary-darker/10 bg-background p-4 text-left text-xs text-foreground">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-semibold">{stakeholderType}</span>
            </div>
            {formData.organization && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-semibold">{formData.organization}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-semibold">
                {formData.locationState} State
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Response SLA:</span>
              <span className="font-semibold text-primary">Under 24 hours</span>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="solid" onClick={handleReset} className="mx-auto">
              Submit another inquiry
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              Tell us how we can collaborate
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Fill out the fields below and our value chain specialists will be
              in touch.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-error/30 bg-error/10 p-3.5 text-xs text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-darker">
              I am a... <span className="text-error">*</span>
            </label>
            <select
              value={stakeholderType}
              onChange={(e) =>
                setStakeholderType(e.target.value as StakeholderType)
              }
              className={`${inputClassName} bg-background font-medium focus:bg-card`}
            >
              <option value="Farmer">
                Farmer (Smallholder, Commercial Grower or Cooperative)
              </option>
              <option value="Buyer">
                Buyer (Food Processor, Feed Mill, FMCG or Exporter)
              </option>
              <option value="Investor">
                Investor (Impact Fund, Venture Capital or Ag-Fintech)
              </option>
              <option value="Partner">
                Partner (Development Agency, Government Board or Logistics)
              </option>
              <option value="Job seeker">
                Job seeker (Engineering, Operations or Agronomy)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="e.g. Babatunde Lawal"
                className={inputClassName}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@organization.com"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                Phone Number (WhatsApp friendly)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+234 800 000 0000"
                className={inputClassName}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">
                Organization / Farm Name
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: e.target.value,
                  })
                }
                placeholder="e.g. Savannah Millers Ltd"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">
              Primary Operational State in Nigeria
            </label>
            <select
              value={formData.locationState}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  locationState: e.target.value,
                })
              }
              className={`${inputClassName} bg-card`}
            >
              <option value="Lagos">
                Lagos State (Commercial / Headquarters)
              </option>
              <option value="Kano">Kano State (Grains & Sesame)</option>
              <option value="Benue">
                Benue State (Tubers, Cassava & Soybeans)
              </option>
              <option value="Oyo">Oyo State (Maize & Poultry Belt)</option>
              <option value="Kwara">Kwara State (Grains & Aggregation)</option>
              <option value="Kaduna">Kaduna State (Grains & Ginger)</option>
              <option value="Niger">Niger State (Paddy Rice & Sesame)</option>
              <option value="Ogun">Ogun State (Agro-Industrial)</option>
              <option value="Other">Other / International</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">
              Message / Inquiry Details <span className="text-error">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Tell us about the crops you grow or procure, current monthly tonnage, or questions regarding PAGEX..."
              className={inputClassName}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="solid"
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold shadow-md"
            >
              <Send className="h-4 w-4" />
              {isSubmitting
                ? "Submitting inquiry..."
                : "Send message to Pazelgreen"}
            </Button>
          </div>

          <div className="text-center text-[11px] text-muted-foreground">
            We respect your data privacy under the Nigeria Data Protection Act.
          </div>
        </form>
      )}
    </div>
  );
}
