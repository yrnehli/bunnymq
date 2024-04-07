import { useTheme } from '@/components/ThemeProvider';
import { Light } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { vs, vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
Light.registerLanguage('json', json);

export type SyntaxHighlighterProps = {
    children: string | string[];
};

export function SyntaxHighlighter({ children }: SyntaxHighlighterProps) {
    const { appearance } = useTheme();

    return (
        <Light language="json" style={appearance === 'dark' ? vs2015 : vs}>
            {children}
        </Light>
    );
}
