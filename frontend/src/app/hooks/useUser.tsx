// app/hooks/useUser.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  isNonprofitMember: boolean;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate an API call or authentication check
    setTimeout(() => {
      setUser({
        id: '1',
        name: 'John Doe',
        isNonprofitMember: true, // Set this to false to test non-member view
      });
    }, 1000);
  }, []);

  return { user };
};