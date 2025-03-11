import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useEditorMode } from '@/context/editor-mode-context';

export default function Markdown({ children }: { children: React.ReactNode }) {
    const { state } = useEditorMode();
    return (
        <MarkdownPreview
            className='flex-wrap text-wrap'
            source={children as string}
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
