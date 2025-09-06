"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface SystemPromptEditorProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

const PRESET_PROMPTS = {
  default: 'Create a high-quality, detailed image based on the user\'s description. Focus on clarity, composition, and visual appeal.',
  realistic: 'Generate a photorealistic image with high attention to detail, natural lighting, and realistic textures. Ensure the composition is well-balanced and visually appealing.',
  artistic: 'Create an artistic interpretation with creative flair, expressive colors, and unique composition. Emphasize artistic style and creative expression over photorealism.',
  professional: 'Generate a professional-quality image suitable for commercial use. Focus on clean composition, appropriate lighting, and polished presentation.',
  creative: 'Push creative boundaries with unique perspectives, innovative compositions, and imaginative elements. Prioritize originality and visual impact.',
  minimal: 'Create a clean, minimalist image with simple composition, elegant use of negative space, and focus on essential elements only.',
  cinematic: 'Generate a cinematic-quality image with dramatic lighting, compelling composition, and movie-like visual storytelling elements.',
  vibrant: 'Create an image with vibrant colors, high contrast, and energetic visual elements. Emphasize boldness and visual impact.',
  custom: '' // This will be handled separately
};

export default function SystemPromptEditor({ systemPrompt, onSystemPromptChange }: SystemPromptEditorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('default');

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset !== 'custom') {
      onSystemPromptChange(PRESET_PROMPTS[preset as keyof typeof PRESET_PROMPTS]);
    }
  };

  const resetToDefault = () => {
    setSelectedPreset('default');
    onSystemPromptChange(PRESET_PROMPTS.default);
  };

  // Determine current preset based on system prompt content
  const getCurrentPreset = () => {
    for (const [key, value] of Object.entries(PRESET_PROMPTS)) {
      if (key !== 'custom' && value === systemPrompt) {
        return key;
      }
    }
    return 'custom';
  };

  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-lg">System Prompt Configuration</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The system prompt defines how the AI interprets and enhances your image descriptions. 
          Customize it to achieve different artistic styles and quality levels.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Selection */}
        <div className="space-y-2">
          <Label htmlFor="preset">Choose a preset or customize your own</Label>
          <div className="flex gap-2">
            <Select
              value={getCurrentPreset()}
              onValueChange={handlePresetChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="realistic">Photorealistic</SelectItem>
                <SelectItem value="artistic">Artistic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="minimal">Minimalist</SelectItem>
                <SelectItem value="cinematic">Cinematic</SelectItem>
                <SelectItem value="vibrant">Vibrant</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={resetToDefault}
              size="sm"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* System Prompt Textarea */}
        <div className="space-y-2">
          <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea
            id="systemPrompt"
            placeholder="Enter your custom system prompt..."
            value={systemPrompt}
            onChange={(e) => {
              onSystemPromptChange(e.target.value);
              setSelectedPreset('custom');
            }}
            rows={4}
            className="min-h-[100px]"
          />
          <div className="text-sm text-slate-500 text-right">
            {systemPrompt.length}/2000 characters
          </div>
        </div>

        {/* Preset Preview */}
        {selectedPreset !== 'custom' && selectedPreset in PRESET_PROMPTS && (
          <div className="space-y-2">
            <Label>Preset Preview</Label>
            <div className="text-sm bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
              {PRESET_PROMPTS[selectedPreset as keyof typeof PRESET_PROMPTS]}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Tips for effective system prompts:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Be specific about the style and quality you want</li>
            <li>• Include technical details like lighting, composition, or color preferences</li>
            <li>• Mention the intended use (artistic, professional, creative, etc.)</li>
            <li>• Keep it concise but descriptive (100-500 characters work best)</li>
            <li>• Test different prompts to find what works best for your needs</li>
          </ul>
        </div>

        {/* Advanced Options */}
        <div className="space-y-2">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
              Advanced Options
            </summary>
            <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>
                <strong>Variables you can use:</strong>
              </p>
              <ul className="ml-4 space-y-1">
                <li>• The user's prompt will be automatically appended</li>
                <li>• Style parameters will be applied after the system prompt</li>
                <li>• Quality settings will enhance the generation process</li>
              </ul>
              <p className="mt-2">
                <strong>Best practices:</strong>
              </p>
              <ul className="ml-4 space-y-1">
                <li>• Start with general quality requirements</li>
                <li>• Add specific style or mood instructions</li>
                <li>• End with composition or technical requirements</li>
              </ul>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}