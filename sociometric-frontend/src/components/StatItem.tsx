interface StatItemProps {
    label: string
    value: string
    type: 'popular' | 'rejected'
}

const StatItem = ({ label, value, type }: StatItemProps) => (
<section className="stat-item">
    <p className="stat-label">{label}</p>
    <p className={`stat-value ${type}`}>{value}</p>
</section>
)

export default StatItem