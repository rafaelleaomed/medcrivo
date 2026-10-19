"use client";

import { WelcomeBoard } from "@/components/WelcomeBoard";
import { useStudio } from "./StudioProvider";

/** Perfil e preferências (abre sozinho até o primeiro salvamento). */
export function ProfileDialog() {
  const { profile, isProfileOpen, setProfileOpen, saveProfile } = useStudio();
  return (
    <WelcomeBoard
      // Remonta quando o perfil do servidor chega, para o formulário começar preenchido.
      key={`${profile.name}|${profile.onboarded}`}
      isOpen={isProfileOpen}
      onClose={() => setProfileOpen(false)}
      initialProfile={profile}
      onSave={(next) => {
        void saveProfile(next);
      }}
    />
  );
}
