export type PostMeta = {
	title: string
	subtitle?: string
	brief?: string
	date: {
		created: string | null
		modified: string | null
	}
	tags: string[]
}
