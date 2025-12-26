import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import Layout from './pages/layouts/MainLayout';
import ProfileLayout from './pages/layouts/ProfileLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        const page = pages[`./pages/${name}.tsx`];

        if (!page.default.layout) {
            if (name.startsWith('Profile/')) {
                page.default.layout = (page) => <ProfileLayout>{page}</ProfileLayout>;
            } else if (name.startsWith('Separate/') || name.startsWith('auth/')) {
                page.default.layout = { page };
            } else {
                page.default.layout = (page) => <Layout>{page}</Layout>;
            }
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
