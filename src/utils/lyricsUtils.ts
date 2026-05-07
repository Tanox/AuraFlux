// src/utils/lyricsUtils.ts v2.3.10


export interface LrcLine {
    time: number;
    text: string;
}

export const parseLrc = (lrc: string): LrcLine[] => {
    const lines = lrc.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
    const result: LrcLine[] = [];
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

    for (const line of lines) {
        const match = timeRegex.exec(line);
        if (match) {
            const min = parseInt(match[1]);
            const sec = parseInt(match[2]);
            const msStr = match[3] || '0';
            const ms = parseInt(msStr.padEnd(3, '0').slice(0,3));
            const time = min * 60 + sec + ms / 1000;
            const text = line.replace(timeRegex, '').trim();
            if (text) result.push({ time, text });
        }
    }
    return result.sort((a, b) => a.time - b.time);
};
