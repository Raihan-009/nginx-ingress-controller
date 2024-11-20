import { Item } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ryuzaki.me/fastapi';

export const api = {
  async createItem(item: Item) {
    try {
      const response = await fetch(`${API_URL}/items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return response.json();
    } catch (err) {
      throw new Error('Failed to create item');
    }
  },
  
  async getItem(name: string) {
    try {
      const response = await fetch(`${API_URL}/items/${name}`);
      return response.json();
    } catch (err) {
      throw new Error('Failed to fetch item');
    }
  }
};
