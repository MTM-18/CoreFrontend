// src/components/layout/PageShell.tsx
import type { ReactNode } from "react";

type PageShellProps = {
    children: ReactNode;
    align?: "top" | "center";
};

export default function PageShell({ children, align = "top" }: PageShellProps) {
    return (
        <div
            className={
                "min-h-screen w-full " +
                (align === "center" ? "flex items-center justify-center" : "")
            }
        >
            <main className="w-full">{children}</main>
        </div>
    );
}
