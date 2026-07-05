export function Border({
  children, className
}: Readonly<{
  children: React.ReactNode;
  className?: string
}>) {
    return (
        <div className={"overflow-hidden rounded-2xl border border-gray-400 bg-slate-50/80 dark:bg-black/20 " + className}>
            {children}
        </div>
    )
}