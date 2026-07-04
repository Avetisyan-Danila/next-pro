import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Metadata } from 'next'
import { cacheLife, cacheTag } from 'next/cache'

// export const dynamic = 'force-static'
// export const revalidate = 30

export const metadata: Metadata = {
	title: 'NextPro | Blog',
	description:
		'Read our latest blog posts about the latest trends in web development',
	category: 'Web Development',
	authors: [{ name: 'NextPro' }],
}

export default function BlogPage() {
	return (
		<div className='py-12'>
			<div className='text-center pb-12'>
				<h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl'>
					Our Blog
				</h1>
				<p className='pt-4 max-w-2xl mx-auto text-xl text-muted-foreground'>
					Insides, thoughts, and trends from our team
				</p>
			</div>

			{/* <Suspense fallback={<BlogSkeleton />}> */}
			<LoadBlogList />
			{/* </Suspense> */}
		</div>
	)
}

async function LoadBlogList() {
	'use cache'
	cacheLife('hours')
	cacheTag('blog-list')

	const data = await fetchQuery(api.posts.getPosts)

	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{data?.map(post => (
				<Card key={post._id} className='pt-0'>
					<div className='relative w-full h-48 overflow-hidden'>
						<Image
							src={
								post.imageUrl ??
								'https://images.unsplash.com/photo-1781989302295-ce96b5be39d8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
							}
							alt='image'
							fill
							className='rounded-t-lg object-cover'
						/>
					</div>

					<CardContent>
						<Link href={`/blog/${post._id}`}>
							<h1 className='text-2xl font-bold hover:text-primary'>
								{post.title}
							</h1>
						</Link>
						<p className='text-muted-foreground line-clamp-3'>{post.body}</p>
					</CardContent>
					<CardFooter>
						<Link
							className={buttonVariants({ className: 'w-full' })}
							href={`/blog/${post._id}`}
						>
							Read More
						</Link>
					</CardFooter>
				</Card>
			))}
		</div>
	)
}

function BlogSkeleton() {
	return (
		<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{[...Array(6)].map((_, index) => (
				<div key={index} className='flex flex-col space-y-3'>
					<Skeleton className='w-full h-48 rounded-xl' />

					<div className='space-y-2 flex flex-col'>
						<Skeleton className='w-3/4 h-6' />
						<Skeleton className='w-full h-4' />
						<Skeleton className='w-full h-4' />
					</div>
				</div>
			))}
		</div>
	)
}
