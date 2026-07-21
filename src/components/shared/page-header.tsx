import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ breadcrumbs, title, actions }: PageHeaderProps) {
  // If no explicit title, use the last breadcrumb as the title
  const pageTitle = title ?? breadcrumbs[breadcrumbs.length - 1]?.label ?? "";
  const navCrumbs = title ? breadcrumbs : breadcrumbs.slice(0, -1);

  return (
    <div className="mb-4">
      {navCrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {navCrumbs.map((crumb, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <span className="text-muted-foreground">{crumb.label}</span>
                  )}
                </BreadcrumbItem>
                {i < navCrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="mt-1 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{pageTitle}</h1>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}
