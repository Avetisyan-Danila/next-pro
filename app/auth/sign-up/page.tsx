'use client'

import { signUpSchema } from '@/app/schemas/auth'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { authClient } from '@/lib/auth-client'
import z from 'zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'

export default function SignUpPage() {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		startTransition(async () => {
			await authClient.signUp.email({
				email: data.email,
				name: data.name,
				password: data.password,
				fetchOptions: {
					onSuccess: () => {
						toast.success('Account created successfully')
						router.push('/auth/login')
					},
					onError: ({ error }) => {
						toast.error(error.message)
					},
				},
			})
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>Create an account to get started</CardDescription>
			</CardHeader>

			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							name='name'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Name</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										placeholder='John Doe'
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name='email'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Email</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										placeholder='john.doe@example.com'
										type='email'
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name='password'
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Password</FieldLabel>
									<Input
										aria-invalid={fieldState.invalid}
										placeholder='********'
										type='password'
										{...field}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Button type='submit' disabled={isPending}>
							{isPending ? (
								<>
									<Loader2 className='size-4 animate-spin' />
									<span>Signing up...</span>
								</>
							) : (
								'Sign Up'
							)}
						</Button>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
