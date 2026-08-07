import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'gold' | 'dark' | 'rose';
    glow?: boolean;
    hover?: boolean;
    as?: 'div' | 'section' | 'article';
    style?: React.CSSProperties;
    onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    variant = 'default',
    glow = false,
    hover = false,
    as: Tag = 'div',
    style,
    onClick,
}) => {
    const variantClass = {
        default: 'glass-card',
        gold:    'glass-card-gold',
        dark:    'glass-card-dark',
        rose:    'glass-card border-rose/20',
    }[variant];

    const glowClass = glow
        ? variant === 'gold'
            ? 'shadow-[0_0_32px_rgba(201,169,110,0.2)] border-gold/30'
            : 'shadow-[0_0_32px_rgba(212,165,165,0.15)] border-rose/25'
        : '';

    const motionTags = {
        div: motion.div,
        section: motion.section,
        article: motion.article,
    };
    const Component = motionTags[Tag] || motion.div;

    return (
        <Component
            className={`rounded-2xl border ${variantClass} ${glowClass} ${className}`}
            style={style}
            whileHover={hover ? {
                y: -4,
                boxShadow: variant === 'gold'
                    ? '0 12px 30px rgba(201, 169, 110, 0.25)'
                    : '0 12px 30px rgba(212, 165, 165, 0.12)',
                borderColor: variant === 'gold' ? 'rgba(201, 169, 110, 0.5)' : 'rgba(212, 165, 165, 0.4)'
            } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            onClick={onClick}
        >
            {children}
        </Component>
    );
};