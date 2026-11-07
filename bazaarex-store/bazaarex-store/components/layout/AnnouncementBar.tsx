import { siteConfig } from "@/data/site";

export function AnnouncementBar() {
  return (
    <div className="bg-charcoal px-4 py-2.5 text-center text-xs text-ivory sm:text-sm" data-theme="dark">
      <p>{siteConfig.announcement}</p>
    </div>
  );
}
