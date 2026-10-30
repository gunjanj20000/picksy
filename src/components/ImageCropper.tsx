import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Crop as CropIcon, Check, X } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  open: boolean;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 90 },
      1,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageCropper = ({ imageSrc, onCropComplete, onCancel, open }: ImageCropperProps) => {
  const { language } = useLanguage();
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }, []);

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) {
      if (imageSrc) {
        onCropComplete(imageSrc);
      }
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set max bounds to keep local storage clean
    const targetWidth = Math.min(completedCrop.width * scaleX, 800);
    const targetHeight = Math.min(completedCrop.height * scaleY, 800);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.88);
    onCropComplete(croppedImageUrl);
  }, [completedCrop, imageSrc, onCropComplete]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto rounded-3xl p-6 bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <CropIcon className="w-6 h-6" />
            <span>{language === 'hi' ? 'तस्वीर क्रॉप व सेट करें' : 'Crop & Adjust Image'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="max-h-[55vh] overflow-hidden rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-700 bg-slate-50 dark:bg-slate-950 p-2">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-h-[50vh]"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={onImageLoad}
                className="max-h-[50vh] object-contain rounded-xl"
              />
            </ReactCrop>
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3 justify-end pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 sm:flex-initial rounded-xl text-base h-12"
          >
            <X className="w-5 h-5 mr-1" />
            {language === 'hi' ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button
            onClick={getCroppedImg}
            className="flex-1 sm:flex-initial rounded-xl text-base h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold"
          >
            <Check className="w-5 h-5 mr-1" />
            {language === 'hi' ? 'स्वीकार करें' : 'Apply Crop'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
