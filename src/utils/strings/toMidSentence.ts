export const toMidSentence = (text: string) => text.replace(/^\p{Lu}(?!\p{Lu})/u, (letter) => letter.toLowerCase());
