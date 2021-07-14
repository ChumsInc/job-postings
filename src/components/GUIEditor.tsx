import React, {useEffect, useRef, useState} from 'react';
import ErrorBoundary from "chums-ducks/dist/components/ErrorBoundary";
import {Editor, IAllProps} from '@tinymce/tinymce-react';

const defaultEditorOptions: IAllProps['init'] = {
    height: 350,
    menubar: false,
    plugins: ['paste code help wordcount lists'],
    toolbar: 'undo redo | styleselect | bold italic | bullist numlist outdent indent | removeformat | help',
    block_formats: 'Paragraph=p; Heading 1=h3; Heading 2=h4; Heading 3=h5; Heading 4=h6; Preformatted=pre',
    toolbar_mode: "sliding",
    style_formats: [
        {
            title: 'Headings', items: [
                // { title: 'Heading 1', format: 'h3' },
                {title: 'Heading 2', format: 'h4'},
                {title: 'Heading 3', format: 'h5'},
                {title: 'Heading 4', format: 'h6'},
            ]
        },
        {
            title: 'Inline', items: [
                {title: 'Bold', format: 'bold'},
                {title: 'Italic', format: 'italic'},
                {title: 'Underline', format: 'underline'},
                {title: 'Strikethrough', format: 'strikethrough'},
                {title: 'Superscript', format: 'superscript'},
                {title: 'Subscript', format: 'subscript'},
                {title: 'Code', format: 'code'}
            ]
        },
        {
            title: 'Blocks', items: [
                {title: 'Paragraph', format: 'p'},
                {title: 'Blockquote', format: 'blockquote'},
                {title: 'Div', format: 'div'},
                {title: 'Pre', format: 'pre'}
            ]
        },
    ]
}

interface GUIMceEditorProps {
    value: string,
    options?: object,
    onChange: (any: any) => void,
    onChangeTimer?: number
}

const GUIEditor: React.FC<GUIMceEditorProps> = ({value, options = {}, onChange, onChangeTimer = 1000}) => {
    const editorRef = useRef<Editor>(null);
    const [timer, setTimer] = useState(0);
    const [content, setContent] = useState(value);

    useEffect(() => {
        setContent(value || '');
        return () => window.clearTimeout(timer);
    }, [value]);

    const changeHandler = (immediate?: boolean) => {
        if (!editorRef.current || !editorRef.current.editor) {
            return;
        }
        window.clearTimeout(timer);
        if (immediate) {
            const currentContent = editorRef.current.editor?.getContent() ?? '';
            setContent(currentContent);
            return onChange(currentContent);
        }
        const _timer = window.setTimeout(() => {
            if (!editorRef.current || !editorRef.current.editor) {
                return;
            }
            const currentContent = editorRef.current.editor?.getContent() ?? '';
            setContent(currentContent);
            onChange(currentContent);
        }, onChangeTimer);
        setTimer(_timer);
    }


    const editorOptions = {
        ...defaultEditorOptions,
        ...options
    }
    return (
        <ErrorBoundary>
            <Editor
                apiKey="dtw3713kp9s6j1pxq59ga10o1xeimkkmpiwki2kb2q5wxzvz"
                ref={editorRef}
                initialValue={content || ''}
                init={editorOptions}
                onChange={() => changeHandler()}
                onBlur={() => changeHandler(true)}
            />
        </ErrorBoundary>
    )
}
export default GUIEditor;
