import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, systemPrompt, parameters = {} } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Construct the enhanced prompt with parameters
    let enhancedPrompt = prompt.trim();
    
    // Add style modifiers based on parameters
    if (parameters.style) {
      const styleModifiers = {
        realistic: 'photorealistic, high detail, professional photography',
        artistic: 'artistic style, creative interpretation, expressive',
        abstract: 'abstract art, conceptual, modern artistic style',
        cinematic: 'cinematic lighting, movie-like quality, dramatic composition',
        minimalist: 'clean, simple, minimalist design, elegant composition'
      };
      
      if (styleModifiers[parameters.style as keyof typeof styleModifiers]) {
        enhancedPrompt += `, ${styleModifiers[parameters.style as keyof typeof styleModifiers]}`;
      }
    }

    // Add quality modifiers
    if (parameters.quality) {
      const qualityModifiers = {
        standard: 'good quality',
        high: 'high quality, detailed, sharp',
        ultra: 'ultra high quality, 8k, masterpiece, highly detailed'
      };
      
      if (qualityModifiers[parameters.quality as keyof typeof qualityModifiers]) {
        enhancedPrompt += `, ${qualityModifiers[parameters.quality as keyof typeof qualityModifiers]}`;
      }
    }

    // Apply system prompt if provided
    const finalPrompt = systemPrompt 
      ? `${systemPrompt}\n\nUser request: ${enhancedPrompt}`
      : enhancedPrompt;

    console.log('Generating image with prompt:', finalPrompt);

    // Call the custom AI endpoint
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'mdtanzil858@gmail.com',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      
      return NextResponse.json(
        { 
          error: 'Image generation failed',
          details: `AI service returned ${response.status}: ${errorText}`
        },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('AI API Response:', result);

    // Extract image URL from the response
    // The response format may vary, so we'll handle different possible structures
    let imageUrl: string | null = null;

    if (result.choices && result.choices[0] && result.choices[0].message) {
      const content = result.choices[0].message.content;
      
      // Check if content is a direct URL
      if (typeof content === 'string' && (content.startsWith('http://') || content.startsWith('https://'))) {
        imageUrl = content.trim();
      }
      // Check if content contains a URL pattern
      else if (typeof content === 'string') {
        const urlMatch = content.match(/https?:\/\/[^\s<>\"]+/);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        }
      }
    }

    // Alternative response structures
    if (!imageUrl && result.data && Array.isArray(result.data) && result.data.length > 0) {
      if (result.data[0].url) {
        imageUrl = result.data[0].url;
      }
    }

    if (!imageUrl && result.url) {
      imageUrl = result.url;
    }

    if (!imageUrl) {
      console.error('No image URL found in response:', result);
      return NextResponse.json(
        { 
          error: 'Invalid response from AI service',
          details: 'No image URL was returned from the generation service'
        },
        { status: 500 }
      );
    }

    // Generate a unique ID for this image
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      image: {
        id: imageId,
        url: imageUrl,
        prompt: prompt,
        enhancedPrompt: enhancedPrompt,
        systemPrompt: systemPrompt || null,
        parameters: parameters,
        timestamp: Date.now(),
        generationTime: Date.now() // Could be calculated if we track start time
      }
    });

  } catch (error) {
    console.error('Image generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}