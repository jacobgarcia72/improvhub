export function Border({
  children, className
}: Readonly<{
  children: React.ReactNode;
  className?: string
}>) {
    return (
        <div className={"overflow-hidden rounded-3xl border border-slate-300 bg-slate-50/80 shadow-sm shadow-slate-800/10 " + className}>
            {children}
        </div>
    )
}