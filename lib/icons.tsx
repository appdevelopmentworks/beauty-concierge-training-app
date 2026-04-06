import {
  ClipboardCheck,
  MessageSquareHeart,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ClipboardCheck,
  MessageSquareHeart,
  Sparkles,
  WalletCards,
  PhoneCall,
  ShieldAlert,
};

export function getCategoryIcon(name: string) {
  return iconMap[name] ?? ClipboardCheck;
}
