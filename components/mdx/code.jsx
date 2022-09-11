import SyntaxHighlighter from 'react-syntax-highlighter';
// import monokai from 'react-syntax-highlighter/dist/cjs/styles/hljs/monokai';

export const code = ({ className, ...props }) => {
	const match = /language-(\w+)/.exec(className || '');
	return match ? (
		<SyntaxHighlighter
			language={match[1]}
			PreTag="div"
			// style={monokai}
			{...props}
		/>
	) : (
		<code className={className} {...props} />
	);
};
