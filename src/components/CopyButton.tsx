import React, {useState} from 'react';

interface CopyButtonProps extends React.ButtonHTMLAttributes<any> {
    copy: string,
    text?: string,
    copiedText?: string,
}

const CopyButton: React.FC<CopyButtonProps> = ({
                                                   copy,
                                                   text,
                                                   copiedText,
                                                   className,
                                                   onClick,
                                                   children,
                                                   ...props
                                               }) => {
    if (!className) {
        className = 'btn btn-sm btn-outline-primary';
    }
    const [clicked, setClicked] = useState(false);
    const [timer, setTimer] = useState(0);

    const clickHandler = async () => {
        clearTimeout(timer);
        await navigator.clipboard.writeText(copy);
        setClicked(true);
        const _timer = window.setTimeout(() => {
            setClicked(false);
        }, 2000);
        setTimer(_timer);
    }

    return (
        <button type="button" className={className} {...props} onClick={clickHandler}>
            {clicked ? (copiedText || 'Copied to Clipboard') : (text || children)}
        </button>
    )
}
export default CopyButton;
