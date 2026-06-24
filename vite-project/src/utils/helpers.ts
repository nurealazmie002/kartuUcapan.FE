import type { CardData } from '../types';

// Base64 helper as a local fallback
export function encodeCard(data: CardData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return window.btoa(binary);
  } catch (e) {
    return '';
  }
}

export function decodeCard(base64Str: string): CardData | null {
  try {
    const binary = window.atob(base64Str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch (e) {
    return null;
  }
}
