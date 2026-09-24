import type { ConsumerCharts } from '@/types/dashboard';
import { ChartCard } from './charts/ChartCard';
import { HBar } from './charts/HBar';
import { VBar } from './charts/VBar';

export function ConsumerChartsView({ charts }: { charts: ConsumerCharts }) {
    return (
        <div className="space-y-4 p-6">

            {/* Monthly trend — full width */}
            <ChartCard title="Complaints per Month" subtitle="Monthly volume trend">
                <VBar data={charts.monthly} />
            </ChartCard>

            {/* 2-column grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <ChartCard title="Complaints per Region" subtitle="Top 10 wilayas">
                    <HBar data={charts.byRegion} />
                </ChartCard>

                <ChartCard title="Complaints per Brand" subtitle="Top 10 brands">
                    <HBar data={charts.byBrand} color="#8b5cf6" />
                </ChartCard>

                <ChartCard title="Complaints per Batch Number" subtitle="Top 10 batches">
                    <HBar data={charts.byBatch} color="#06b6d4" />
                </ChartCard>

                <ChartCard title="Average Rating per Product" subtitle="Scale 1 – 5">
                    <HBar
                        data={charts.avgRatingProduct}
                        color="#f59e0b"
                        domain={[0, 5]}
                        valueFormatter={(v) => v.toFixed(1)}
                        valueLabel="Avg rating"
                    />
                </ChartCard>

                <ChartCard title="Average Rating per Brand" subtitle="Scale 1 – 5" >
                    <HBar
                        data={charts.avgRatingBrand}
                        color="#f59e0b"
                        domain={[0, 5]}
                        valueFormatter={(v) => v.toFixed(1)}
                        valueLabel="Avg rating"
                    />
                </ChartCard>

            </div>
        </div>
    );
}
