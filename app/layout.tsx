import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SOS JF",
    description: "Sistema colaborativo de alertas de emergência",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
