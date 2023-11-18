
import wordsTxt from '../words.txt?raw';

export const source = 'https://github.com/dwyl/english-words/blob/master/words.txt'

export function list(): readonly string[] {
    return wordsTxt.split('\n')
        .map((s) => s.toUpperCase())
        .filter((s) => /^[A-Z]{5}$/.test(s));
}