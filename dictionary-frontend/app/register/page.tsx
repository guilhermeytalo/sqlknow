'use client';
import { useFormStatus, useFormState } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { registerAction } from '@/actions/auth';

const initialState = { success: false, error: null };

export default function RegisterPage() {
    const [state, formAction] = useFormState(registerAction, initialState);
    const { pending } = useFormStatus();

    return (
        <div className="max-w-md mx-auto mt-20 p-4">
            <h1 className="text-2xl mb-4">Register</h1>
            <form action={formAction} className="flex flex-col gap-4">
                <Input name="name" placeholder="Nome" className="border p-2" required />
                <Input name="email" placeholder="Email" className="border p-2" required />
                <Input name="password" type="password" placeholder="Senha" className="border p-2" required />
                <Button type="submit" disabled={pending} className="bg-green-600 text-white p-2 rounded">
                    {pending ? 'Registrando...' : 'Registrar'}
                </Button>
                {state.error && <p className="text-red-500">{state.error}</p>}
            </form>
        </div>
    );
}