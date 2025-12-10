import Navbar from '../Navbar';

export default function Layout({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <>
            <Navbar />
            <main className={className}>{children}</main>
        </>
    );
}
