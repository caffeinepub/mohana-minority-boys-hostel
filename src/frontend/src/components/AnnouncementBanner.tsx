import { useQuery } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { useActor } from "../hooks/useActor";

export default function AnnouncementBanner() {
  const { actor, isFetching } = useActor();

  const { data: settings } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });

  if (!settings?.announcementText) return null;

  return (
    <div className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] py-1.5 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center gap-1.5 font-display font-bold text-xs uppercase tracking-wider">
          <Megaphone className="w-3.5 h-3.5" />
          Notice
        </div>
        <div className="announcement-ticker flex-1 min-w-0">
          <span className="ticker-text text-xs font-body font-medium">
            {settings.announcementText}
          </span>
        </div>
      </div>
    </div>
  );
}
