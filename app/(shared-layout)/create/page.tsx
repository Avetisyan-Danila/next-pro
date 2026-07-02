'use client'

import { postSchema } from '@/app/schemas/blog'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { createPostAction } from '@/app/actions'

export default function CreatePage() {
	const [isPending, startTransition] = useTransition()

	const form = useForm<z.infer<typeof postSchema>>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			title: '',
			content: '',
			image: undefined,
		},
	})

	const onSubmit = (values: z.infer<typeof postSchema>) => {
		startTransition(async () => {
			console.log('Hello from the client')
			await createPostAction(values)
		})
	}

	return (
		<div className='py-12'>
			<div className='text-center mb-12'>
				<h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>
					Create Post
				</h1>
				<p className='text-xl text-muted-foreground pt-4'>
					Share your thoughts with the world
				</p>
			</div>

			<Card className='w-full max-w-xl mx-auto'>
				<CardHeader>
					<CardTitle>Create Blog Article</CardTitle>
					<CardDescription>Create a new blog article</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup className='gap-y-4'>
							<Controller
								name='title'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Title</FieldLabel>
										<Input placeholder='Enter your title' {...field} />
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name='content'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Content</FieldLabel>
										<Textarea placeholder='Enter your content' {...field} />
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name='image'
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Image</FieldLabel>
										<Input
											placeholder='Upload your image'
											type='file'
											accept='image/*'
											onChange={e => {
												const file = e.target.files?.[0]
												field.onChange(file)
											}}
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
										<span>Loading...</span>
									</>
								) : (
									'Create Post'
								)}
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
