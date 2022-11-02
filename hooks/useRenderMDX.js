import { useState, useEffect } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import markdown from 'remark-parse';
import rehypeKatex from 'rehype-katex';

export const useRenderMDX = (content) => {
	const [renderedContent, setRenderedContent] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const serialized = await serialize(content, {
					mdxOptions: {
						remarkPlugins: [markdown, remarkMath],
						rehypePlugins: [rehypeKatex],
						format: 'mdx',
					},
					parseFrontmatter: false,
				});
				setRenderedContent(serialized);
			} catch (err) {
				console.error(err);
			}
		})();
	}, [content]);

	return renderedContent;
};
