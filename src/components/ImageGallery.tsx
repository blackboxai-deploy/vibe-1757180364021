"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  parameters?: {
    aspectRatio?: string;
    quality?: string;
    style?: string;
  };
}

interface ImageGalleryProps {
  images: GeneratedImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleDownload = async (image: GeneratedImage) => {
    try {
      setDownloadingId(image.id);
      
      const response = await fetch(image.url);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    // Could add a toast notification here
  };

  if (images.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b9221ead-e053-4fe8-a60a-97d73b6499fe.png" 
                alt="Empty gallery illustration with placeholder images and upload icons"
                className="mx-auto opacity-50 rounded-lg"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">No images generated yet</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Start creating amazing images with AI. Your generated images will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Generated Images</h2>
        <p className="text-slate-600 dark:text-slate-400">
          {images.length} image{images.length !== 1 ? 's' : ''} in your gallery
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative group">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2bfe5308-e940-45c6-b3e4-bbe2a20f7df8.png';
                }}
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => setSelectedImage(image)}
                    >
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Generated Image</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                      <div className="space-y-4">
                        <div className="aspect-square max-h-[70vh] overflow-hidden rounded-lg">
                          <img
                            src={selectedImage.url}
                            alt={selectedImage.prompt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <strong>Prompt:</strong>
                            <p className="mt-1 text-sm bg-slate-100 dark:bg-slate-800 p-2 rounded">
                              {selectedImage.prompt}
                            </p>
                          </div>
                          {selectedImage.parameters && (
                            <div className="flex flex-wrap gap-2">
                              {selectedImage.parameters.style && (
                                <Badge variant="secondary">Style: {selectedImage.parameters.style}</Badge>
                              )}
                              {selectedImage.parameters.quality && (
                                <Badge variant="secondary">Quality: {selectedImage.parameters.quality}</Badge>
                              )}
                              {selectedImage.parameters.aspectRatio && (
                                <Badge variant="secondary">Ratio: {selectedImage.parameters.aspectRatio}</Badge>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-slate-500">
                            Generated on {formatTimestamp(selectedImage.timestamp)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleDownload(selectedImage)}
                            disabled={downloadingId === selectedImage.id}
                          >
                            {downloadingId === selectedImage.id ? 'Downloading...' : 'Download'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleCopyPrompt(selectedImage.prompt)}
                          >
                            Copy Prompt
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload(image)}
                  disabled={downloadingId === image.id}
                >
                  {downloadingId === image.id ? '...' : 'Download'}
                </Button>
              </div>
            </div>
            
            {/* Image Info */}
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                {image.prompt}
              </p>
              
              {image.parameters && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {image.parameters.style && (
                    <Badge variant="outline" className="text-xs">
                      {image.parameters.style}
                    </Badge>
                  )}
                  {image.parameters.quality && (
                    <Badge variant="outline" className="text-xs">
                      {image.parameters.quality}
                    </Badge>
                  )}
                </div>
              )}
              
              <p className="text-xs text-slate-500">
                {formatTimestamp(image.timestamp)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button (for future implementation) */}
      {images.length >= 20 && (
        <div className="text-center mt-8">
          <Button variant="outline">
            Load More Images
          </Button>
        </div>
      )}
    </div>
  );
}