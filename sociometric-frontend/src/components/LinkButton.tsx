import { Link, LinkProps, useNavigate } from 'react-router';
import { Button, ButtonProps } from 'react-bootstrap';
import { forwardRef } from 'react';

// Create a type that merges ButtonProps and LinkProps, excluding conflicting props
type LinkButtonProps = Omit<ButtonProps, 'as' | 'href'> & LinkProps;

// Create a custom component that satisfies both type systems
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ to, children, ...props }, ref) => {
    // Create a wrapper component that satisfies both type systems
    const LinkWrapper: React.FC<LinkProps> = ({ children: linkChildren, ...linkProps }) => (
      <Link {...linkProps} ref={ref as React.Ref<HTMLAnchorElement>}>
        {linkChildren}
      </Link>
    );
    LinkWrapper.displayName = 'LinkWrapper';
    const navigate = useNavigate();

    return (
      <Button
        onClick={()=> navigate(to)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

LinkButton.displayName = 'LinkButton';