'use client';
import { useFormStatus } from 'react-dom';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/actions/auth';
import React, { useActionState } from 'react';

type LoginState = {
    success: boolean;
    error: string | undefined;
};

const initialState: LoginState = { success: false, error: undefined };

export default function LoginPage() {
    const [state, formAction] = useActionState(loginAction, initialState);
    const { pending } = useFormStatus();
    const router = useRouter();

    useEffect(() => {
        if (state.success) router.push('/dictionary');
    }, [state.success, router]);

    return (
        <div className="max-w-md mx-auto mt-20 p-4">
            <h1 className="text-2xl mb-4">Login</h1>
            <form action={formAction} className="flex flex-col gap-4">
                <Input name="email" placeholder="Email" className="border p-2" required />
                <Input name="password" type="password" placeholder="Senha" className="border p-2" required />
                <Button type="submit" disabled={pending} className="bg-blue-600 text-white p-2 rounded">
                    {pending ? 'Entrando...' : 'Entrar'}
                </Button>
                {state.error && <p className="text-red-500">{state.error}</p>}
            </form>
        </div>
    );
}