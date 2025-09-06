"use client";

import { useState } from 'react';
import ImageGenerator from '@/components/ImageGenerator';
import ImageGallery from '@/components/ImageGallery';
import GenerationHistory from '@/components/GenerationHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function Home() {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageGenerated = (newImage: GeneratedImage) => {
    setGeneratedImages(prev => [newImage, ...prev]);
    
    // Save to localStorage
    const savedImages = JSON.parse(localStorage.getItem('generationHistory') || '[]');
    const updatedImages = [newImage, ...savedImages].slice(0, 50); // Keep last 50 images
    localStorage.setItem('generationHistory', JSON.stringify(updatedImages));
  };

  const handleGenerationStart = () => {
    setIsGenerating(true);
  };

  const handleGenerationEnd = () => {
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <img 
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/22c23146-ce28-4402-be9d-8407fdff6cf8.png" 
              alt="AI Image Generator Logo - Modern creative design with gradient elements"
              className="mx-auto mb-6 rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Image Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Create stunning, high-quality images from text descriptions using advanced AI technology. 
            Bring your imagination to life with powerful image generation capabilities.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  AI
                </div>
                <h3 className="font-semibold mb-2">Advanced AI Models</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Powered by state-of-the-art FLUX models for exceptional image quality
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  ⚡
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Generate high-quality images in seconds with optimized processing
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  ∞
                </div>
                <h3 className="font-semibold mb-2">Unlimited Creativity</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Explore endless possibilities with customizable prompts and styles
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate">
              <ImageGenerator 
                onImageGenerated={handleImageGenerated}
                onGenerationStart={handleGenerationStart}
                onGenerationEnd={handleGenerationEnd}
                isGenerating={isGenerating}
              />
            </TabsContent>
            
            <TabsContent value="gallery">
              <ImageGallery images={generatedImages} />
            </TabsContent>
            
            <TabsContent value="history">
              <GenerationHistory 
                images={generatedImages}
                onImageRegenerate={(image) => {
                  // Could implement regeneration functionality here
                  console.log('Regenerate:', image);
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}