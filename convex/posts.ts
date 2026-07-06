import { mutation, query } from './_generated/server'
import { ConvexError, v } from 'convex/values'
import { authComponent } from './auth'
import { Doc, Id } from './_generated/dataModel'

export const createPost = mutation({
	args: {
		title: v.string(),
		body: v.string(),
		imageStorageId: v.id('_storage'),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.safeGetAuthUser(ctx)

		if (!user) {
			throw new ConvexError('Unauthorized')
		}

		const blogArticle = await ctx.db.insert('posts', {
			title: args.title,
			body: args.body,
			authorId: user._id,
			imageStorageId: args.imageStorageId,
		})

		return blogArticle
	},
})

export const getPosts = query({
	handler: async ctx => {
		const posts = await ctx.db.query('posts').order('desc').collect()

		return await Promise.all(
			posts.map(async post => {
				const resolvedImageUrl = post.imageStorageId
					? await ctx.storage.getUrl(post.imageStorageId)
					: null

				return {
					...post,
					imageUrl: resolvedImageUrl,
				}
			}),
		)
	},
})

export const generateImageUploadURL = mutation({
	args: {},
	handler: async ctx => {
		const user = await authComponent.safeGetAuthUser(ctx)

		if (!user) {
			throw new ConvexError('Unauthorized')
		}

		return await ctx.storage.generateUploadUrl()
	},
})

export const getPostById = query({
	args: {
		postId: v.id('posts'),
	},
	handler: async (ctx, args) => {
		const post = await ctx.db.get(args.postId)

		if (!post) {
			return null
		}

		const resolvedImageUrl = post?.imageStorageId
			? await ctx.storage.getUrl(post.imageStorageId)
			: null

		return { ...post, imageUrl: resolvedImageUrl }
	},
})

interface SearchResult {
	_id: Id<'posts'>
	title: string
	body: string
}

export const searchPosts = query({
	args: {
		term: v.string(),
		limit: v.number(),
	},
	handler: async (ctx, args) => {
		const limit = args.limit

		const result: SearchResult[] = []

		const seen = new Set()

		const pushDocs = async (docs: Doc<'posts'>[]) => {
			for (const doc of docs) {
				if (seen.has(doc._id)) continue

				seen.add(doc._id)
				result.push({
					_id: doc._id,
					title: doc.title,
					body: doc.body,
				})

				if (result.length >= limit) break
			}
		}

		const titleMatches = await ctx.db
			.query('posts')
			.withSearchIndex('search_title', q => q.search('title', args.term))
			.take(limit)

		await pushDocs(titleMatches)

		if (result.length < limit) {
			const bodyMatches = await ctx.db
				.query('posts')
				.withSearchIndex('search_body', q => q.search('body', args.term))
				.take(limit - result.length)

			await pushDocs(bodyMatches)
		}

		return result
	},
})
