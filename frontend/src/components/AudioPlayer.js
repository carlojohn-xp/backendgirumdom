import React, { useState, useEffect, useRef } from 'react';
import { ttsAPI } from '../services/api';

function AudioPlayer({ memoryId, content }) {
    const [audioUrl, setAudioUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState('');
    const audioRef = useRef(null);

    useEffect(() => {
        checkExistingAudio();
    }, [memoryId]);

    const checkExistingAudio = async () => {
        try {
            const response = await ttsAPI.getByMemoryId(memoryId);
            if (response.data && response.data.url) {
                setAudioUrl(response.data.url);
            }
        } catch (error) {
            console.log('No existing audio found');
        }
    };

    const generateAudio = async () => {
        if (!content) {
            setError('No content available to generate audio');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await ttsAPI.generate(content, memoryId);
            const url = typeof response.data === 'string' ? response.data : response.data.url;
            setAudioUrl(url);
        } catch (error) {
            setError('Failed to generate audio');
            console.error('TTS generation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setPlaying(!playing);
        }
    };

    return (
        <div className="audio-player">
            <h4>Audio Narration</h4>

            {error && <p className="error-text">{error}</p>}

            {!audioUrl && !loading && (
                <button onClick={generateAudio} className="btn-secondary">
                    Generate Audio
                </button>
            )}

            {loading && <p>Generating audio...</p>}

            {audioUrl && (
                <div className="audio-controls">
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        onEnded={() => setPlaying(false)}
                    />
                    <button onClick={togglePlay} className="btn-play">
                        {playing ? 'Pause' : 'Play'}
                    </button>
                    <a
                        href={audioUrl}
                        download
                        className="btn-download"
                    >
                        Download
                    </a>
                </div>
            )}
        </div>
    );
}

export default AudioPlayer;
