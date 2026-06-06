
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.users.find(formData.username);
    
    // Simplistic password check for the demo
    if (user && user.password === formData.password) {
      localStorage.setItem('kw_current_user', JSON.stringify(user));
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 p-4">
        <Button variant="ghost" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>

      <Card className="w-full max-w-md glass-morphism border-accent/20 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-accent/20 p-3 rounded-2xl">
              <ShieldCheck className="h-8 w-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Secure Access</CardTitle>
          <CardDescription>Welcome back to Kickwise 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                required 
                className="bg-background/50"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-background/50"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-destructive text-sm font-medium">{error}</p>}

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 font-headline h-12 shadow-[0_0_15px_rgba(132,125,255,0.3)]">
              <LogIn className="mr-2 h-4 w-4" /> AUTHORIZE LOGIN
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            New here? <span onClick={() => router.push('/register')} className="text-accent cursor-pointer hover:underline">Register Account</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
