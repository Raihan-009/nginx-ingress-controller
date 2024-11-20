'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Item {
  name: string;
  description?: string;
  price: number;
}

const ItemCard = ({ item }: { item: Item }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle>{item.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">{item.description}</p>
      <p className="text-lg font-semibold mt-2">${item.price.toFixed(2)}</p>
    </CardContent>
  </Card>
);

export default function Home() {
  const [items, setItems] = useState<Record<string, Item>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });

  // Get the API URL from environment variables
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ryuzaki.me/fastapi';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Submitting to:', `${API_URL}/items/`); // Debug log
      
      const newItem = {
        name: formData.name,
        description: formData.description || "",
        price: parseFloat(formData.price)
      };

      console.log('Sending data:', newItem); // Debug log

      const response = await fetch(`${API_URL}/items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create item');
      }

      const item = await response.json();
      setItems(prev => ({ ...prev, [item.name]: item }));
      setFormData({ name: '', description: '', price: '' });
      setSuccess('Item added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error details:', err); // Debug log
      setError(err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Store Items Manager</CardTitle>
          <p className="text-sm text-gray-500">Connected to: {API_URL}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                step="0.01"
              />
              <Button type="submit" disabled={loading} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                {loading ? 'Adding...' : 'Add Item'}
              </Button>
            </div>
          </form>

          {success && (
            <Alert className="mt-4 bg-green-50">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mt-4 bg-red-50">
              <AlertDescription className="text-red-600">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(items).map((item) => (
          <ItemCard key={item.name} item={item} />
        ))}
      </div>
    </main>
  );
}