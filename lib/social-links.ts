import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

// Single source of truth for all social links.
// Update hrefs here and both Footer and ContactPage will reflect the change.
export const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaXTwitter, href: "#", label: "Twitter/X" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
];
