import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Bed,
  Bath,
  Square,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
} from "lucide-react";
import Image from "next/image";

interface FloorPlan {
  label: string;
  bedrooms: number;
  bathrooms: number;
  builtUpArea: number;
  carpetArea: number;
  balconyCount: number;
  image: string | string[];
}

interface FloorPlansProps {
  floorPlans: FloorPlan[];
}

interface FloorPlanZoomModalProps {
  imageUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const FloorPlanZoomModal = ({
  imageUrl,
  title,
  isOpen,
  onClose,
}: FloorPlanZoomModalProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev * 1.25, 5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev / 1.25, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handlePinchZoom = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      // Simple pinch zoom implementation
      if (distance > 100) {
        zoomIn();
      } else if (distance < 50) {
        zoomOut();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden [&>button]:hidden">
        <div className="relative w-full h-full bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 bg-white border-b">
            <h3 className="text-sm md:text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={zoomOut}
                size="sm"
                variant="outline"
                className="h-7 w-7 md:h-8 md:w-8 p-0"
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                onClick={resetZoom}
                size="sm"
                variant="outline"
                className="h-7 w-7 md:h-8 md:w-8 p-0"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                onClick={zoomIn}
                size="sm"
                variant="outline"
                className="h-7 w-7 md:h-8 md:w-8 p-0"
                disabled={scale >= 5}
              >
                <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                onClick={onClose}
                size="sm"
                variant="outline"
                className="h-7 w-7 md:h-8 md:w-8 p-0"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 relative overflow-hidden bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                ref={imageRef}
                src={imageUrl}
                alt={title}
                className={`max-w-none transition-transform duration-200 ${
                  isDragging
                    ? "cursor-grabbing"
                    : scale > 1
                    ? "cursor-grab"
                    : "cursor-default"
                }`}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => {
                  handleTouchMove(e);
                  handlePinchZoom(e);
                }}
                onTouchEnd={handleTouchEnd}
                onLoad={() => {
                  if (imageRef.current) {
                    const img = imageRef.current;
                    const container = img.parentElement;
                    if (container) {
                      const containerAspect =
                        container.clientWidth / container.clientHeight;
                      const imageAspect = img.naturalWidth / img.naturalHeight;

                      if (imageAspect > containerAspect) {
                        img.style.width = "100%";
                        img.style.height = "auto";
                      } else {
                        img.style.width = "auto";
                        img.style.height = "100%";
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-2 md:p-3 bg-white border-t">
            <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
              <span>Zoom: {Math.round(scale * 100)}%</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-center">Scroll to zoom • Drag to pan</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FloorPlans = ({ floorPlans }: FloorPlansProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null);

  if (!floorPlans || floorPlans.length === 0) {
    return null;
  }

  const visiblePlans = showAll ? floorPlans : floorPlans.slice(0, 3);
  const hasMorePlans = floorPlans.length > 3;

  return (
    <section className="bg-white rounded-xl p-3 md:p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-gray-900">
        Floor Plans
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
        {visiblePlans.map((plan, index) => (
          <Card
            key={index}
            className="border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedPlan(plan)}
          >
            <div className="relative h-32 md:h-48 w-full bg-gray-100">
              {plan.image && (Array.isArray(plan.image) ? plan.image[0] : plan.image) ? (
                <Image
                  src={Array.isArray(plan.image) ? plan.image[0] : plan.image}
                  alt={plan.label}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Square className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-2 md:p-3">
              <h3 className="font-medium text-xs md:text-sm mb-2">
                {plan.label}
              </h3>
              <div className="grid grid-cols-3 gap-1 md:gap-2 text-xs">
                <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded">
                  <Bed className="w-2 h-2 md:w-3 md:h-3 mb-1" />
                  <span className="text-[8px] md:text-[10px] whitespace-nowrap">
                    {plan.bedrooms} BHK
                  </span>
                </div>
                <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded">
                  <Bath className="w-2 h-2 md:w-3 md:h-3 mb-1" />
                  <span className="text-[8px] md:text-[10px] whitespace-nowrap">
                    {plan.bathrooms} Bath
                  </span>
                </div>
                <div className="flex flex-col items-center p-1 md:p-2 bg-gray-50 rounded">
                  <Square className="w-2 h-2 md:w-3 md:h-3 mb-1" />
                  <span className="text-[8px] md:text-[10px] whitespace-nowrap">
                    {plan.builtUpArea} sqft
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMorePlans && (
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Show More ({floorPlans.length - 3} more)
              </>
            )}
          </Button>
        </div>
      )}

      {/* Zoom Modal */}
      {selectedPlan && (
        <FloorPlanZoomModal
          imageUrl={Array.isArray(selectedPlan.image) ? selectedPlan.image[0] : selectedPlan.image}
          title={selectedPlan.label}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </section>
  );
};
