import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Item } from '@/types';

export const ItemCard = ({ item }: { item: Item }) => (
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