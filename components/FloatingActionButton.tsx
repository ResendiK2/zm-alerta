'use client';

interface FloatingActionButtonProps {
    onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
    return (
        <button className="fab" onClick={onClick}>
            + REPORTAR
        </button>
    );
}
