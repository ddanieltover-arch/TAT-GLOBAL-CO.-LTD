import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';
import {forwardRef, type ButtonHTMLAttributes, type ReactNode} from 'react';

export const buttonVariants = {
  gold: 'bg-gold text-primary-dark hover:bg-gold-light',
  'outline-primary':
    'border border-primary bg-transparent font-medium text-primary hover:bg-primary hover:text-white',
  'outline-white':
    'border border-white/35 bg-transparent text-white backdrop-blur-sm hover:border-gold-light hover:bg-white/5 hover:text-gold-light',
} as const;

export const buttonSizes = {
  sm: 'min-h-11 px-3 py-2 text-sm',
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-11 px-6 py-3 text-base',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  type?: never;
  disabled?: never;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href' | 'className' | 'children'>;

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70 motion-reduce:transition-none';

export function buttonClassName({
  variant = 'gold',
  size = 'md',
  fullWidth,
  className,
}: Pick<ButtonBaseProps, 'variant' | 'size' | 'fullWidth' | 'className'>) {
  return cn(baseClass, buttonVariants[variant], buttonSizes[size], fullWidth && 'w-full', className);
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {variant = 'gold', size = 'md', fullWidth, className, children, href, ...props},
  ref
) {
  const classes = buttonClassName({variant, size, fullWidth, className});

  if (href) {
    const linkProps = props as Omit<ButtonAsLink, keyof ButtonBaseProps | 'href'>;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button ref={ref} className={classes} {...buttonProps}>
      {children}
    </button>
  );
});

export default Button;
