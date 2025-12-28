import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin } from '../service/auth';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await authLogin(username, password);
            if (data.access) {
                // Store username for display in sidebar
                localStorage.setItem('username', username);
                navigate('/admin');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-[500px] min-h-[300px] py-8 shadow-xl flex flex-col justify-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Login to admin site</CardTitle>
                    <CardDescription className="text-center">
                        Enter your username and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-8">
                            {error && (
                                <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-3">
                                <Label htmlFor="username" className="text-md">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="username"
                                    className="h-12 text-lg"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-md">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="password"
                                    className="h-12 text-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-8">
                            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl h-12 text-lg" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                   {/* Optional footer content can go here */}
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
