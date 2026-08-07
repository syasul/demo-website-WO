import React from 'react';
import { motion } from 'framer-motion';

interface GlassButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'glass' | 'outline' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    href?: string;
    as?: 'button' | 'a';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    onClick,
    type = 'button',
    disabled = false,
    href,
    as: Tag = href ? 'a' : 'button',
}) => {
    const variantClass = {
        primary: 'glass-btn-primary btn-shimmer text-white font-semibold',
        glass:   'glass-btn text-dark/90 font-medium',
        outline: 'border border-rose/40 bg-transparent text-rose hover:bg-rose/10 transition-colors font-medium',
        gold:    'btn-shimmer bg-gold text-white border border-gold hover:bg-gold-light transition-colors font-semibold',
    }[variant];

    const sizeClass = {
        sm: 'px-4 py-2 text-xs tracking-wide rounded-xl',
        md: 'px-6 py-3 text-sm tracking-wide rounded-xl',
        lg: 'px-8 py-4 text-sm tracking-widest uppercase rounded-2xl',
    }[size];

    const props = {
        className: `inline-flex items-center justify-center gap-2 ${variantClass} ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`,
        onClick: disabled ? undefined : onClick,
        ...(Tag === 'button' ? { type, disabled } : { href }),
    };

    return (
        <motion.button
            {...(Tag === 'button' ? props as any : {})}
            whileHover={!disabled ? { scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            {children}
        </motion.button>
    );
};