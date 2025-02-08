import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useEditorMode } from '@/context/editor-mode-context';
import CodeCopyBtn from './codeCopyBtn';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export default function Markdown({ children }: { children: React.ReactNode }) {
    const { state } = useEditorMode();
    const Pre = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => <pre className="blog-pre" {...props}>
        <CodeCopyBtn>{children}</CodeCopyBtn>
        {children}
    </pre>
    return (
        <MarkdownPreview
            source={children as string}
            components={{
                pre: Pre,
            }}
            rehypePlugins={[
                [
                    rehypeSanitize,
                    {
                        ...defaultSchema,
                        attributes: {
                            ...defaultSchema.attributes,
                            svg: ['className', 'hidden', 'viewBox', 'fill', 'height', 'width'],
                            path: ['fill-rule', 'd'],
                            div: ['className', 'class', 'data-code', ...(defaultSchema.attributes?.div || [])],
                        },
                        tagNames: [...(defaultSchema.tagNames || []), 'svg', 'path', 'div'],
                    },
                ],
            ]}
            style={{ backgroundColor: 'transparent', color: state.codeTheme === 'vs-dark' ? '#fff' : '#000' }}
        />
    )
}
