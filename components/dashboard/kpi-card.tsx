import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  valueColor?: 'default' | 'green' | 'red' | 'blue';
  helpText?: string;
}

const colorClasses = {
  default: 'text-foreground',
  green: 'text-green-500',
  red: 'text-red-500',
  blue: 'text-blue-500',
};

export function KPICard({
  title,
  value,
  subtitle,
  valueColor = 'default',
  helpText,
}: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {helpText && (
          <div title={helpText}>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClasses[valueColor]}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
