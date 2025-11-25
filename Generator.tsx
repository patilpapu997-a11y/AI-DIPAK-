import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { generateImage } from '../services/geminiService';
import { updateUserCredits, saveImage } from '../services/mockBackend';
import { STORAGE_KEYS, IMAGE_COST } from '../constants';
import { User } from '../types';
import { Download, AlertTriangle } from 'lucide-react';

export const Generator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const uStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (uStr) {
      setUser(JSON.parse(uStr));
    }
    
    // Check for API Key
    const checkKey = async () => {
      try {
        const aiStudio = (window as any).aistudio;
        if (aiStudio && aiStudio.hasSelectedApiKey) {
          const hasKey = await aiStudio.hasSelectedApiKey();
          setHasApiKey(hasKey);
        } else {
             // If window.aistudio is missing, assume dev environment or fallback 
             // but per prompt we should assume it exists. 
             // We'll treat it as false to force the button if possible, but safe fallback to true if undefined to not block UI in non-compliant browser
             setHasApiKey(true);
        }
      } catch (e) {
        console.error("Error checking API key status", e);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      const aiStudio = (window as any).aistudio;
      if (aiStudio && aiStudio.openSelectKey) {
        await aiStudio.openSelectKey();
        // Assume success as per prompt instructions (race condition mitigation)
        setHasApiKey(true);
      }
    } catch (e: any) {
      // If "Requested entity was not found"
      if (e.message && e.message.includes("Requested entity was not found")) {
         setHasApiKey(false);
         alert("Please select a valid API key again.");
         const aiStudio = (window as any).aistudio;
         if (aiStudio) await aiStudio.openSelectKey();
         setHasApiKey(true);
      } else {
         console.error(e);
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (user.credits < IMAGE_COST) {
      setError(`Not enough credits. You need ${IMAGE_COST} credits to generate an image.`);
      return;
    }

    const aiStudio = (window as any).aistudio;
    if (!hasApiKey && aiStudio) {
        // Enforce key selection
        await handleSelectKey();
    }

    setIsGenerating(true);
    setError('');
    setGeneratedImage(null);

    try {
      const result = await generateImage(prompt, size);
      setGeneratedImage(result.imageUrl);
      
      // Deduct credits
      const updatedUser = updateUserCredits(user.id, IMAGE_COST, 'subtract');
      setUser(updatedUser); // Update local state
      
      // Dispatch event for sidebar update
      window.dispatchEvent(new Event('user-updated'));

      // Save to history
      saveImage(user.id, prompt, result.imageUrl, 'gemini-3-pro-image-preview', size);

    } catch (err: any) {
      console.error(err);
      setError('Failed to generate image. Please try again or check your API key settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Image Generator</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Create stunning visuals with Gemini Nano Banana Pro (gemini-3-pro-image-preview).
            Cost: {IMAGE_COST} Credits per image.
          </p>
        </div>

        {!hasApiKey && (window as any).aistudio && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg flex items-start space-x-3">
                <AlertTriangle className="text-yellow-600 dark:text-yellow-500 shrink-0" />
                <div>
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200">API Key Required</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                        You must select your own paid API key to use this high-quality model.
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline ml-1">Billing Docs</a>
                    </p>
                    <Button size="sm" onClick={handleSelectKey} variant="secondary">Select API Key</Button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Prompt</label>
                <textarea
                  className="w-full h-32 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:outline-none resize-none"
                  placeholder="Describe your imagination... e.g., 'A cyberpunk street food vendor in Tokyo, neon lights, 4k, realistic'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Resolution</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['1K', '2K', '4K'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`py-2 px-4 rounded-lg border font-medium transition-all ${
                        size === s 
                          ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900' 
                          : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400 dark:border-gray-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                isLoading={isGenerating}
                disabled={(!hasApiKey && !!(window as any).aistudio) || user?.credits! < IMAGE_COST}
              >
                Generate Image (-{IMAGE_COST} Credits)
              </Button>
            </form>
          </div>

          {/* Preview */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center min-h-[400px] border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            {isGenerating ? (
              <div className="text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
                <p className="text-gray-500 font-medium">Dreaming up your image...</p>
                <p className="text-xs text-gray-400">Using Gemini 3 Pro Image Preview</p>
              </div>
            ) : generatedImage ? (
              <div className="relative group w-full h-full">
                <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={generatedImage} 
                    download={`dipak-digital-${Date.now()}.png`}
                    className="flex items-center space-x-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition"
                  >
                    <Download size={20} />
                    <span>Download {size}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center p-6">
                <p>Your creation will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};