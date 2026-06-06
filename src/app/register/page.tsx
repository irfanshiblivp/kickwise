
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, AcademicYear, Department } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    year: '2nd' as AcademicYear,
    department: 'CSE' as Department,
    password: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;
    
    const user = db.users.create({
      username: formData.username,
      year: formData.year,
      department: formData.department,
      password: formData.password
    });

    localStorage.setItem('kw_current_user', JSON.stringify(user));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 p-4">
        <Button variant="ghost" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </div>

      <Card className="w-full max-w-md glass-morphism border-primary/20 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-headline font-bold">Create Profile</CardTitle>
          <CardDescription>Join the Kickwise 2026 Prediction League</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Choose a username" 
                required 
                className="bg-background/50"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={formData.year} onValueChange={(v: AcademicYear) => setFormData({...formData, year: v})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={formData.department} onValueChange={(v: Department) => setFormData({...formData, department: v})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select Dept" />
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

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 font-headline h-12">
              <UserPlus className="mr-2 h-4 w-4" /> REGISTER NOW
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <span onClick={() => router.push('/login')} className="text-primary cursor-pointer hover:underline">Login</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
