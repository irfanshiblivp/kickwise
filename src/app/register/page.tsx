
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, AcademicYear, Department } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    year: '2nd' as AcademicYear,
    department: 'CSE' as Department,
    password: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) return;
    
    // Check if username already exists
    const existing = db.users.find(formData.username);
    if (existing) {
      setError('Username already taken. Please choose another.');
      return;
    }

    const user = db.users.create({
      username: formData.username,
      year: formData.year,
      department: formData.department,
      password: formData.password
    });

    localStorage.setItem('kw_current_user', JSON.stringify(user));
    if (user.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="absolute top-0 left-0 p-4">
        <Button variant="ghost" onClick={() => router.push('/')} className="text-foreground/60">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>

      <Card className="w-full max-w-md glass-morphism border-primary/20 shadow-2xl rounded-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-headline font-black tracking-tight text-primary">CREATE PLAYER</CardTitle>
          <CardDescription className="text-xs uppercase font-bold tracking-widest text-foreground/40">Dhruva 2026 Prediction League</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="py-2 px-3 rounded-none bg-destructive/5 text-destructive border-destructive/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Player Alias</Label>
              <Input 
                id="username" 
                required 
                className="bg-white/50 border-primary/10 rounded-none h-11 focus-visible:ring-primary/30"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Batch</Label>
                <Select value={formData.year} onValueChange={(v: AcademicYear) => setFormData({...formData, year: v})}>
                  <SelectTrigger className="bg-white/50 border-primary/10 rounded-none h-11">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Dept</Label>
                <Select value={formData.department} onValueChange={(v: Department) => setFormData({...formData, department: v})}>
                  <SelectTrigger className="bg-white/50 border-primary/10 rounded-none h-11">
                    <SelectValue placeholder="Dept" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">CSE</SelectItem>
                    <SelectItem value="ECE">ECE</SelectItem>
                    <SelectItem value="EEE">EEE</SelectItem>
                    <SelectItem value="ME">ME</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" spellCheck={false} className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                className="bg-white/50 border-primary/10 rounded-none h-11 focus-visible:ring-primary/30"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-headline font-bold h-12 rounded-none mt-2 shadow-lg">
              <UserPlus className="mr-2 h-4 w-4" /> REGISTER PROFILE
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-primary/5 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Already registered? <span onClick={() => router.push('/login')} className="text-primary cursor-pointer hover:underline">Sign In</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
