import { company, whatsappLink } from "../config/company";
import { WhatsappIcon } from "./SocialIcons";

export function WhatsAppButton() {
  if (!company.whatsapp) return null;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95"
    >
      <WhatsappIcon size={28} />
    </a>
  );
}
