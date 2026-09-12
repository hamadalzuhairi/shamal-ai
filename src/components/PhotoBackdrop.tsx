import { IMAGES } from "@/lib/images";

/** خلفية الجبال الضبابية المشتركة بين الشاشة التمهيدية وصفحات الدخول */
export function PhotoBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 photo-cover"
        style={{ backgroundImage: `url(${IMAGES.splash})`, backgroundPosition: "center 70%", filter: "saturate(0.55) brightness(0.82) contrast(0.85)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#e9eeee]/95 via-[#e9eeee]/55 to-[#e9eeee]/20" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/75 to-transparent" />
    </>
  );
}
