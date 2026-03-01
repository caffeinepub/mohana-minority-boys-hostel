import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { GalleryImage } from "../backend.d";
import { useGetAllGalleryImages } from "../hooks/useQueries";

const FALLBACK_IMAGES: GalleryImage[] = [
  {
    id: 1,
    title: "Hostel Main Building",
    imageUrl: "/assets/generated/hostel-hero.dim_1200x600.jpg",
    uploadedAt: BigInt(Date.now()),
    uploadedBy: "admin",
  },
  {
    id: 2,
    title: "Study Hall",
    imageUrl: "/assets/generated/hostel-hero.dim_1200x600.jpg",
    uploadedAt: BigInt(Date.now()),
    uploadedBy: "admin",
  },
  {
    id: 3,
    title: "Annual Day Celebration",
    imageUrl: "/assets/generated/hostel-hero.dim_1200x600.jpg",
    uploadedAt: BigInt(Date.now()),
    uploadedBy: "admin",
  },
];

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const current = images[currentIndex];
  if (!current) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-0 overflow-hidden">
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image */}
          <div className="aspect-video relative">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Caption */}
          <div className="p-4 text-center">
            <p className="font-display font-semibold text-white">
              {current.title}
            </p>
            <p className="text-white/50 text-xs font-body mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function GalleryPage() {
  const { data: imagesData, isLoading } = useGetAllGalleryImages();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images =
    imagesData && imagesData.length > 0 ? imagesData : FALLBACK_IMAGES;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="bg-primary/10 text-primary mb-4 font-body text-xs px-3 py-1 border-primary/20">
            Photo Gallery
          </Badge>
          <h1 className="font-display font-bold text-4xl text-foreground mb-3">
            Our Gallery
          </h1>
          <p className="text-muted-foreground font-body max-w-md mx-auto text-sm">
            Moments from Post Matric Minority Boys Hostel, Mohana — events,
            facilities, and student life.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Images className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display font-semibold text-xl text-foreground mb-2">
              No Photos Yet
            </h2>
            <p className="text-muted-foreground font-body text-sm max-w-xs mx-auto">
              The gallery is currently empty. Check back later for photos.
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm font-body mb-6">
              {images.length} photo{images.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-border shadow-xs">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-body text-muted-foreground text-center truncate">
                    {image.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
