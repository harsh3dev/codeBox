import React from "react";

interface HandleClickEvent extends React.MouseEvent<HTMLDivElement> {}
interface CodeCopyBtnProps {
    children: React.ReactNode;
}

export default function CodeCopyBtn({ children }: CodeCopyBtnProps) {
    const [copyOk, setCopyOk] = React.useState(false);

    const iconColor = copyOk ? '#0af20a' : '#ddd';
    const icon = copyOk ? 'fa-check-square' : 'fa-copy';


    const handleClick = (e: HandleClickEvent) => {
        navigator.clipboard.writeText((children as React.ReactElement).props.children[0].props.children[0]);
        console.log(children);

        setCopyOk(true);
        setTimeout(() => {
            setCopyOk(false);
        }, 500);
    }

    return (
        <div className="code-copy-btn">
            <i className={`fas ${icon}`} onClick={handleClick} style={{color: iconColor}} />
        </div>
    )
}