import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Zona da Mata Alertas",
    description: "Sistema colaborativo de alertas de emergência",
    viewport: {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
        viewportFit: "cover",
    },
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
