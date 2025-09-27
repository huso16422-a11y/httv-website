import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white shadow-lg rounded-lg p-6">{children}</div>;
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}
