import styles from './code.module.scss';
import SyntaxHighlighter from 'react-syntax-highlighter';
import monokai from 'react-syntax-highlighter/dist/cjs/styles/hljs/monokai';

export const code = ({ className, ...props }) => {
	const match = /language-(\w+)/.exec(className || '');
	return match ? (
		<SyntaxHighlighter
			wrapLines={true}
			language={match[1]}
			PreTag="div"
			style={monokai}
			{...props}
			className={styles.codeBlock}
		/>
	) : (
		<code className={`${styles.inline} ${className}`} {...props} />
	);
};
