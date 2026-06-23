'use client'

import Link from 'next/link'
import { Button, buttonVariants } from '../ui/button'
import { useConvexAuth } from 'convex/react'
import { ThemeToggle } from './theme-toggle'
import { Skeleton } from '../ui/skeleton'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function Navbar() {
	const { isAuthenticated, isLoading } = useConvexAuth()
	const router = useRouter()

	return (
		<nav className='w-full py-5 flex items-center justify-between'>
			<div className='flex items-center gap-8'>
				<Link href='/'>
					<h1 className='text-3xl font-bold'>
						Next<span className='text-blue-500'>Pro</span>
					</h1>
				</Link>

				<div className='flex items-center gap-2'>
					<Link className={buttonVariants({ variant: 'ghost' })} href='/'>
						Home
					</Link>
					<Link className={buttonVariants({ variant: 'ghost' })} href='/blog'>
						Blog
					</Link>
					<Link className={buttonVariants({ variant: 'ghost' })} href='/create'>
						Create
					</Link>
				</div>
			</div>

			<div className='flex items-center gap-2'>
				{isLoading ? (
					<Skeleton className='w-35 h-8' />
				) : isAuthenticated ? (
					<Button
						onClick={() =>
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {
										toast.success('Logged out successfully')
										router.push('/auth/login')
									},
									onError: ({ error }) => {
										toast.error(error.message)
									},
								},
							})
						}
					>
						Logout
					</Button>
				) : (
					<>
						<Link className={buttonVariants()} href='/auth/sign-up'>
							Sign up
						</Link>
						<Link
							className={buttonVariants({ variant: 'outline' })}
							href='/auth/login'
						>
							Login
						</Link>
					</>
				)}

				<ThemeToggle />
			</div>
		</nav>
	)
}
