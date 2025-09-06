"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SystemPromptEditor from './SystemPromptEditor';
import LoadingSpinner from './LoadingSpinner';

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

interface ImageGeneratorProps {
  onImageGenerated: (image: GeneratedImage) => void;
  onGenerationStart: () => void;
  onGenerationEnd: () => void;
  isGenerating: boolean;
}

export default function ImageGenerator({ 
  onImageGenerated, 
  onGenerationStart, 
  onGenerationEnd, 
  isGenerating 
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('Create a high-quality, detailed image based on the user\'s description. Focus on clarity, composition, and visual appeal.');
  const [parameters, setParameters] = useState({
    quality: 'high',
    style: 'realistic',
    aspectRatio: '1:1'
  });
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showSystemPromptEditor, setShowSystemPromptEditor] = useState(false);

  // Prompt suggestions
  const promptSuggestions = [
    "A serene mountain landscape at sunset with golden light",
    "A futuristic city skyline with flying cars and neon lights",
    "A magical forest with glowing mushrooms and fairy lights",
    "A cozy coffee shop interior with warm lighting and books",
    "An abstract geometric pattern in vibrant colors",
    "A portrait of a wise old wizard with a long beard",
    "A steampunk mechanical dragon breathing golden steam",
    "A peaceful zen garden with cherry blossoms"
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isGenerating) {
      setGenerationProgress(0);
      interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);
    } else {
      setGenerationProgress(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image');
      return;
    }

    setError(null);
    onGenerationStart();
    setGenerationProgress(10);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          systemPrompt: systemPrompt.trim() || null,
          parameters: parameters
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Generation failed');
      }

      if (data.success && data.image) {
        setGenerationProgress(100);
        onImageGenerated(data.image);
        
        // Clear the prompt after successful generation
        // setPrompt(''); // Commented out to keep the prompt for potential regeneration
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setTimeout(() => {
        onGenerationEnd();
        setGenerationProgress(0);
      }, 1000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleParameterChange = (key: string, value: string) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Generation Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Create Your Image
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSystemPromptEditor(!showSystemPromptEditor)}
            >
              {showSystemPromptEditor ? 'Hide' : 'Show'} System Prompt
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Prompt Editor */}
          {showSystemPromptEditor && (
            <SystemPromptEditor
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe what you want to create</Label>
            <Textarea
              id="prompt"
              placeholder="Enter a detailed description of the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="min-h-[100px]"
              disabled={isGenerating}
            />
            <div className="text-sm text-slate-500 text-right">
              {prompt.length}/1000 characters
            </div>
          </div>

          {/* Generation Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select
                value={parameters.quality}
                onValueChange={(value) => handleParameterChange('quality', value)}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Quality</SelectItem>
                  <SelectItem value="ultra">Ultra High Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Select
                value={parameters.style}
                onValueChange={(value) => handleParameterChange('style', value)}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="artistic">Artistic</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="cinematic">Cinematic</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspectRatio">Aspect Ratio</Label>
              <Select
                value={parameters.aspectRatio}
                onValueChange={(value) => handleParameterChange('aspectRatio', value)}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                  <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                  <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                  <SelectItem value="9:16">Vertical (9:16)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Generating your image...</Label>
                <span className="text-sm text-slate-500">{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
              <LoadingSpinner />
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </Button>
        </CardContent>
      </Card>

      {/* Prompt Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Inspiration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {promptSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto p-3 justify-start whitespace-normal"
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isGenerating}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}