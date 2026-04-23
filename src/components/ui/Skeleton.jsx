function Shimmer({ className = '', style }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-muted/12 ${className}`}
      style={style}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-muted/10">
      <Shimmer className="w-10 h-10 rounded-xl mb-4" />
      <Shimmer className="h-3 w-24 mb-2.5" />
      <Shimmer className="h-7 w-36 mb-3" />
      <Shimmer className="h-3 w-20" />
    </div>
  )
}

export function SkeletonRow({ cols = 7 }) {
  const pcts = [55, 30, 20, 25, 25, 20, 15]
  return (
    <tr className="border-b border-muted/6">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Shimmer className="h-4" style={{ width: `${pcts[i] ?? 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonChart() {
  const bars = [62, 82, 44, 100, 72, 91, 56]
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card border border-muted/10 h-full">
      <div className="flex items-center justify-between mb-6">
        <Shimmer className="h-5 w-52" />
        <Shimmer className="h-6 w-28 rounded-full" />
      </div>
      <div className="flex items-end gap-3 h-[210px] px-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 animate-pulse bg-muted/15 rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}
