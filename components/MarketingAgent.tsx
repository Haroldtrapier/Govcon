import React, { useState } from 'react';

export default function MarketingAgent() {
  const [activeTab, setActiveTab] = useState<'generate' | 'schedule' | 'analytics'>('generate');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedPost, setGeneratedPost] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGeneratePost = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_post',
          data: { topic, tone },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedPost(result.post);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('Failed to generate post');
    } finally {
      setLoading(false);
    }
  };

  const handlePostToLinkedIn = async () => {
    if (!generatedPost) return;

    alert('LinkedIn posting requires LinkedIn API integration. Post copied to clipboard!');
    navigator.clipboard.writeText(generatedPost);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #06080f 0%, #0d1117 100%)',
      padding: '40px 20px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            LinkedIn Marketing Agent
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#9ca3af' }}>
            AI-powered LinkedIn content generation and automation
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', justifyContent: 'center' }}>
          {['generate', 'schedule', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#1f2937',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div style={{ 
            background: '#1f2937', 
            padding: '32px', 
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '24px' }}>Generate LinkedIn Post</h2>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '8px' }}>Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., SAM.gov opportunities, FEMA contracting"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#9ca3af', display: 'block', marginBottom: '8px' }}>Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '1rem',
                }}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="inspirational">Inspirational</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <button
              onClick={handleGeneratePost}
              disabled={loading || !topic}
              style={{
                padding: '16px 32px',
                background: loading ? '#6b7280' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 600,
                width: '100%',
                marginBottom: '24px',
              }}
            >
              {loading ? 'Generating...' : 'Generate Post'}
            </button>

            {generatedPost && (
              <div>
                <h3 style={{ color: 'white', marginBottom: '12px' }}>Generated Post:</h3>
                <textarea
                  value={generatedPost}
                  onChange={(e) => setGeneratedPost(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    padding: '16px',
                    background: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    marginBottom: '16px',
                  }}
                />
                <button
                  onClick={handlePostToLinkedIn}
                  style={{
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #0077b5 0%, #005885 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 600,
                    width: '100%',
                  }}
                >
                  📋 Copy to Clipboard (LinkedIn posting coming soon)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div style={{ 
            background: '#1f2937', 
            padding: '32px', 
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', marginBottom: '24px' }}>Schedule Posts</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
              Coming soon: Schedule LinkedIn posts for optimal engagement times
            </p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div style={{ 
            background: '#1f2937', 
            padding: '32px', 
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', marginBottom: '24px' }}>Analytics</h2>
            <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
              Coming soon: Track your LinkedIn post performance and engagement
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
