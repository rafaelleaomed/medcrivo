import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = { title: `Comece aqui · ${BRAND.name}`, robots: { index: false, follow: false } };

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
