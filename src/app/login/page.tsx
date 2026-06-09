
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { LogIn, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const stadiumBg = PlaceHolderImages.find(img => img.id === 'stadium-bg');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.users.find(formData.username);
    
    if (user && user.password === formData.password) {
      localStorage.setItem('kw_current_user', JSON.stringify(user));
      if (user.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('AUTHENTICATION FAILED: INVALID CREDENTIALS');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image 
          src={stadiumBg?.imageUrl || ''} 
          alt="Stadium Background" 
          fill 
          className="object-cover opacity-10 dark:opacity-5 blur-[4px]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/90 to-background" />
      </div>

      <div className="absolute top-6 left-6 z-50">
        <Button variant="ghost" onClick={() => router.push('/')} className="font-black uppercase text-[10px] tracking-widest gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Entrance
        </Button>
      </div>

      <Card className="w-full max-w-md glass-morphism rounded-none classic-border shadow-2xl relative z-10 animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pt-10">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-none border border-primary/20 animate-pop">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-black uppercase tracking-tight">Identity Access</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Command Center Authentication</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-10 pb-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Player Alias</Label>
              <Input 
                id="username" 
                required 
                className="bg-background/50 rounded-none h-12 border-border focus:ring-primary/30 font-bold"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-background/50 rounded-none h-12 border-border focus:ring-primary/30 font-bold pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {error && (
              <p className="text-destructive text-[9px] font-black uppercase tracking-widest text-center bg-destructive/5 py-2 border border-destructive/10">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.3em] h-14 rounded-none shadow-xl transition-all hover:scale-[1.02]">
              AUTHORIZE ACCESS
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-border/50 py-6 bg-muted/30">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            New player? <span onClick={() => router.push('/register')} className="text-primary cursor-pointer hover:underline">Create ID</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
