import React, {useEffect, useState} from "react";
import {convertToRaw, EditorState, convertFromHTML, ContentState} from "draft-js";
import draftToHTML from "draftjs-to-html";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const defaultOptions:object = {
    options: ['inline', 'blockType', 'list', 'remove'],
    inline: {
        options: ['bold', 'italic', 'underline']
    },
    blockType: {
        options: ['Normal', 'H3', 'H4']
    },
    list: {
        options: ['unordered']
    }
};

interface GUIEditorProps {
    value: string,
    options?: object,
    onChange: (any:any) => void,
}
const GUIEditor:React.FC<GUIEditorProps> = ({value, options= {}, onChange}) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const [timer, setTimer] = useState(0);
    useEffect(() => {
        const {contentBlocks, entityMap} = convertFromHTML(value);
        const state = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(state))
    }, [value]);

    const toolbarOptions = {...defaultOptions, ...options};

    const onEditorChange = (state:EditorState) => {
        window.clearTimeout(timer);
        setEditorState(state);
        const _timer = window.setTimeout(() => {
            const raw = convertToRaw(state.getCurrentContent());
            const html = draftToHTML(raw);
            if (html !== (value || '<p></p>\n')) {
                onChange(html);
            }
        }, 1000);
        setTimer(_timer);
    }

    return (
        <Editor toolbar={toolbarOptions} editorClassName="form-control form-control-sm"
                stripPastedStyles
                editorState={editorState} onEditorStateChange={onEditorChange} />
    )
}

export default GUIEditor;
