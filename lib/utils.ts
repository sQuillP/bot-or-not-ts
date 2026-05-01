import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function jwtDecode(token:string): Record<string, unknown> | null {
    try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
}