import React from 'react';
import { ICONS } from '../assets/icons';
import type { IconType } from '../assets/icons';

interface IconProps {
    name: IconType;
    alt?: string;
    className?: string;
    size?: number;
    onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
    name,
    alt,
    className = '',
    size = 24,
    onClick
}) => {
    const iconPath = ICONS[name];

    if (!iconPath) {
        return null;
    }

    return (
        <img
            src={iconPath}
            alt={alt || `${name} icon`}
            className={`icon ${className}`}
            style={{ width: size, height: size }}
            onClick={onClick}
            loading="lazy"
        />
    );
};

export default Icon;
