"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyFormData } from '../property-wizard';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImagesStepProps {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

export function ImagesStep({ formData, updateFormData }: ImagesStepProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      // Create preview URLs for the files
      const previewUrls = validFiles.map(file => URL.createObjectURL(file));
      
      // Store both the files and preview URLs
      const updatedImageFiles = [...(formData.imageFiles || []), ...validFiles];
      const updatedImages = [...(formData.images || []), ...previewUrls];
      
      updateFormData({ 
        imageFiles: updatedImageFiles,
        images: updatedImages 
      });
      
      toast.success(`${validFiles.length} image(s) selected successfully`);
    } catch (error) {
      toast.error('Failed to process images. Please try again.');
      console.error('Image processing error:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images?.filter((_, i) => i !== index) || [];
    const updatedImageFiles = formData.imageFiles?.filter((_, i) => i !== index) || [];
    
    // Revoke the object URL to prevent memory leaks
    if (formData.images?.[index]) {
      URL.revokeObjectURL(formData.images[index]);
    }
    
    updateFormData({ 
      images: updatedImages,
      imageFiles: updatedImageFiles 
    });
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const images = [...(formData.images || [])];
    const imageFiles = [...(formData.imageFiles || [])];
    
    const [movedImage] = images.splice(fromIndex, 1);
    const [movedFile] = imageFiles.splice(fromIndex, 1);
    
    images.splice(toIndex, 0, movedImage);
    imageFiles.splice(toIndex, 0, movedFile);
    
    updateFormData({ 
      images,
      imageFiles 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Images
        </h3>
        <p className="text-gray-600 mb-6">
          Upload high-quality images of your property. The first image will be used as the main photo.
          Images will be uploaded after the property is created.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {uploading ? 'Processing images...' : 'Select Property Images'}
            </h4>
            
            <p className="text-gray-600 mb-4">
              Drag and drop images here, or click to browse
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-red-500 hover:bg-red-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Images
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, WebP. Maximum size: 5MB per image.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      {formData.images && formData.images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">
              Selected Images ({formData.images.length})
            </h4>
            <p className="text-sm text-gray-600">
              Drag to reorder • First image will be the main photo
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((imageUrl, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={imageUrl}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Main Photo Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Main Photo
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                  
                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Image Guidelines</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Upload at least 3-5 high-quality images</li>
          <li>• Include exterior, interior, and key feature photos</li>
          <li>• Ensure good lighting and clear visibility</li>
          <li>• The first image will be displayed as the main property photo</li>
          <li>• Maximum file size: 5MB per image</li>
          <li>• Images will be uploaded after property creation</li>
        </ul>
      </div>

      {/* Info Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <ImageIcon className="w-5 h-5 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-800">
            Images are optional but highly recommended. You can also add images later from your property dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}