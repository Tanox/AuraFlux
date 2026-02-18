// File: app/services/metadataService.ts | Version: v1.9.65
import { Track } from '../types/index.ts';

export const extractMetadata = (file: File): Promise<Track> => {
  return new Promise((resolve) => {
    const basicTrack: Track = {
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: '', // Empty string allows UI to use localized "Unknown Artist"
      identified: false,
      matchSource: 'FILE',
      duration: 0 
    };

    if (window.jsmediatags) {
      window.jsmediatags.read(file, {
        onSuccess: (tag: any) => {
          const { title, artist, picture, USLT, lyrics, LYRICS, TEXT } = tag.tags;
          let albumArtUrl = undefined;
          let lyricsText: string | undefined = undefined;

          // Sequential check for multiple possible lyrics tag names
          const candidateLyrics = lyrics || LYRICS || USLT || TEXT;
          
          if (candidateLyrics) {
            if (typeof candidateLyrics === 'string') {
              lyricsText = candidateLyrics;
            } else if (candidateLyrics.lyrics) {
              lyricsText = candidateLyrics.lyrics;
            } else if (candidateLyrics.data && candidateLyrics.data.lyrics) {
              lyricsText = candidateLyrics.data.lyrics;
            } else if (Array.isArray(candidateLyrics)) {
              // Handle multiple frames (e.g., USLT in different languages)
              lyricsText = candidateLyrics[0]?.lyrics || candidateLyrics[0]?.data?.lyrics || candidateLyrics[0];
            }
          }

          if (picture) {
            try {
              const { data, format } = picture;
              let base64String = "";
              for (let i = 0; i < data.length; i++) base64String += String.fromCharCode(data[i]);
              albumArtUrl = `data:${format};base64,${window.btoa(base64String)}`;
            } catch (e) {}
          }

          resolve({ 
            ...basicTrack, 
            title: title || basicTrack.title, 
            artist: artist || '', // Ensure empty string if tag missing
            albumArtUrl, 
            lyrics: lyricsText, 
            identified: !!(title || artist || lyricsText)
          });
        },
        onError: () => resolve(basicTrack)
      });
    } else resolve(basicTrack);
  });
};