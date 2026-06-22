import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <Card className={cn("rounded-none", className)}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
