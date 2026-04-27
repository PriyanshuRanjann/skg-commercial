type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
};

export function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-primary-blue mt-1">
            {value}
          </p>
          {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
        {icon && <div className="text-primary-orange text-2xl">{icon}</div>}
      </div>
    </div>
  );
}
