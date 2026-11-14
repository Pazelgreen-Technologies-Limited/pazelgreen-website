import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa6";

const icons = { facebook: FaFacebook, x: FaXTwitter, linkedin: FaLinkedin, instagram: FaInstagram, youtube: FaYoutube, other: FaGlobe };

export function companySocialLinks(links: { platform: keyof typeof icons; label: string; url: string }[] | null | undefined) {
  return (links ?? []).map(link => ({ icon: icons[link.platform], href: link.url, label: link.label }));
}
