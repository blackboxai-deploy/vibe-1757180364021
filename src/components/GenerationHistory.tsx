"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface GenerationHistoryProps {
  images: GeneratedImage[];
  onImageRegenerate?: (image: GeneratedImage) => void;
}

export default function GenerationHistory({ images, onImageRegenerate }: GenerationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [historyImages, setHistoryImages] = useState<GeneratedImage[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('generationHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistoryImages(parsed);
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
  }, []);

  // Merge current session images with saved history
  const allImages = [...images, ...historyImages.filter(
    historyImg => !images.some(sessionImg => sessionImg.id === historyImg.id)
  )];

  // Filter and sort images
  const filteredImages = allImages
    .filter(image => {
      const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || image.parameters?.style === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'prompt':
          return a.prompt.localeCompare(b.prompt);
        default: // 'newest'
          return b.timestamp - a.timestamp;
      }
    });

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all generation history? This cannot be undone.')) {
      localStorage.removeItem('generationHistory');
      setHistoryImages([]);
    }
  };

  const exportHistory = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalImages: allImages.length,
      images: allImages.map(img => ({
        id: img.id,
        prompt: img.prompt,
        timestamp: img.timestamp,
        parameters: img.parameters,
        url: img.url
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-image-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getUniqueStyles = () => {
    const styles = new Set<string>();
    allImages.forEach(img => {
      if (img.parameters?.style) {
        styles.add(img.parameters.style);
      }
    });
    return Array.from(styles);
  };

  if (allImages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/395b87f7-79b2-401c-a4dd-1d666f49a964.png" 
                alt="Empty history illustration with clock and document icons"
                className="mx-auto opacity-50 rounded-lg"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">No generation history</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Your image generation history will appear here. Start creating images to build your history.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Generation History</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {allImages.length} total generation{allImages.length !== 1 ? 's' : ''} • 
            {filteredImages.length} shown
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportHistory}>
            Export History
          </Button>
          <Button variant="outline" onClick={clearHistory}>
            Clear History
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="prompt">Prompt A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  {getUniqueStyles().map(style => (
                    <SelectItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredImages.map((image) => (
          <Card key={image.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-24 h-24 object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c61b75be-59c6-4962-b8e0-dee95d830b43.png';
                    }}
                  />
                </div>
                
                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-2">
                    <h3 className="font-medium line-clamp-2">{image.prompt}</h3>
                    <div className="flex flex-wrap gap-1">
                      {image.parameters?.style && (
                        <Badge variant="secondary">{image.parameters.style}</Badge>
                      )}
                      {image.parameters?.quality && (
                        <Badge variant="outline">{image.parameters.quality}</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                    <p className="text-sm text-slate-500">
                      Generated {formatTimestamp(image.timestamp)}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(image.prompt)}
                      >
                        Copy Prompt
                      </Button>
                      {onImageRegenerate && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onImageRegenerate(image)}
                        >
                          Regenerate
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        View Full
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {filteredImages.length >= 50 && (
        <div className="text-center">
          <Button variant="outline">
            Load More History
          </Button>
        </div>
      )}
    </div>
  );
}