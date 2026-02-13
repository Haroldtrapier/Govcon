'use client';

import { useState } from 'react';
import { Sparkles, Copy, Download, RefreshCw, Loader2 } from 'lucide-react';

interface MarketingAgentProps {
  className?: string;
}

export default function MarketingAgent({ className = '' }: MarketingAgentProps) {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('general');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('anthropic');

  const contentTypes = [
    { value: 'general', label: '✨ General Content', desc: 'Any marketing copy' },
    { value: 'email', label: '📧 Email Campaign', desc: 'Email with subject & CTA' },
    { value: 'social', label: '📱 Social Media', desc: 'LinkedIn, Twitter, Facebook' },
    { value: 'landing', label: '🎯 Landing Page', desc: 'High-converting page copy' },
    { value: 'blog', label: '📝 Blog Post', desc: 'SEO-optimized article' },
    { value: 'proposal', label: '📄 Proposal/Capability', desc: 'Professional bid content' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          contentType,
          tone,
          length,
          provider
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
      } else {
        alert('Failed to generate content: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Copied to clipboard!');
  };

  const downloadContent = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `govcon-marketing-${contentType}-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">AI Marketing Agent</h1>
        </div>
        <p className="text-lg text-gray-600">
          Generate professional marketing content for government contractors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Content Settings</h2>

          {/* Content Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to create?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Write an email campaign about our new SAM.gov opportunity search feature..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          {/* Tone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="authoritative">Authoritative</option>
              <option value="conversational">Conversational</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Length */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="short">Short (Quick & punchy)</option>
              <option value="medium">Medium (Standard)</option>
              <option value="long">Long (Comprehensive)</option>
            </select>
          </div>

          {/* Provider */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="anthropic">Claude 3.5 (Recommended)</option>
              <option value="openai">GPT-4</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="wm���jם