import * as React from 'react';
export function getDisplayName(Component: React.ReactType | { name: string }) {
    return (
        typeof Component === 'string' && Component.length > 0
            ? Component
            : (
                (Component as any).displayName ||
                (Component as any).name ||
                'Unknown'
            )
    );
}
