
export const ChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-xl">
                <p className="text-sm font-bold text-gray-700">{payload[0].name}</p>
                <p className="text-xs text-indigo-600 font-semibold">
                    {payload[0].value} Jiwa
                    <span className="text-gray-400 ml-1 font-normal">
                        ({((payload[0].percent || 0) * 100).toFixed(1)}%)
                    </span>
                </p>
            </div>
        );
    }
    return null;
};
