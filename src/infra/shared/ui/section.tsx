import type { ReactNode } from 'react';

import { UICard } from '@infra/shared/ui/card';
import { UIScreen } from '@infra/shared/ui/screen';

export interface UISectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  containerClassName?: string;
  cardClassName?: string;
  contentClassName?: string;
}

export const UISection = ({
  title,
  subtitle,
  children,
  containerClassName,
  cardClassName,
  contentClassName,
}: UISectionProps) => {
  return (
    <UIScreen centered padded={false} className={`px-6 ${containerClassName ?? ''}`.trim()}>
      <UICard
        title={title}
        subtitle={subtitle}
        className={`w-full rounded-3xl p-6 ${cardClassName ?? ''}`.trim()}
        titleClassName="text-3xl"
        contentClassName={`mt-6 ${contentClassName ?? ''}`.trim()}
      >
        {children}
      </UICard>
    </UIScreen>
  );
};
