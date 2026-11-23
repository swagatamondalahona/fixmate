"use client";

export type ChartDatum = {
    label: string;
    value: number;
    color: string;
};

type DashboardChartProps = {
    title: string;
    subtitle?: string;
    data: ChartDatum[];
    totalLabel?: string;
};

export default function DashboardChart({
    title,
    subtitle,
    data,
    totalLabel = "Total",
}: DashboardChartProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const segments = data.reduce<
        Array<ChartDatum & { dashLength: number; offset: number }>
    >((acc, item) => {
        const prevUsed = acc.reduce((sum, s) => sum + s.dashLength, 0);
        const fraction = total > 0 ? item.value / total : 0;
        const dashLength = fraction * circumference;
        acc.push({
            ...item,
            dashLength,
            offset: -prevUsed,
        });
        return acc;
    }, []);

    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]/95">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="grid items-center gap-6 sm:grid-cols-[150px_1fr]">
                {/* Donut Chart */}
                <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                    <svg
                        viewBox="0 0 140 140"
                        className="h-36 w-36 -rotate-90"
                        role="img"
                        aria-label={title}
                    >
                        <circle
                            cx="70"
                            cy="70"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="16"
                            className="text-zinc-200 dark:text-white/10"
                        />

                        {total > 0 &&
                            segments.map(
                                (segment) =>
                                    segment.value > 0 && (
                                        <circle
                                            key={segment.label}
                                            cx="70"
                                            cy="70"
                                            r={radius}
                                            fill="none"
                                            stroke={segment.color}
                                            strokeWidth="16"
                                            strokeDasharray={`${segment.dashLength} ${circumference}`}
                                            strokeDashoffset={segment.offset}
                                            strokeLinecap="butt"
                                        />
                                    )
                            )}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                            {total}
                        </span>
                        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                            {totalLabel}
                        </span>
                    </div>
                </div>

                {/* Horizontal Bar Breakdown */}
                <div className="space-y-3.5">
                    {data.map((item) => {
                        const widthPercent =
                            total > 0
                                ? Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0)
                                : 0;
                        const sharePercent =
                            total > 0
                                ? Math.round((item.value / total) * 100)
                                : 0;

                        return (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2 text-xs">
                                    <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        {item.label}
                                    </span>

                                    <span className="font-semibold text-zinc-900 dark:text-white">
                                        {item.value}{" "}
                                        <span className="font-normal text-zinc-500 dark:text-zinc-400">
                                            ({sharePercent}%)
                                        </span>
                                    </span>
                                </div>

                                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${widthPercent}%`,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
