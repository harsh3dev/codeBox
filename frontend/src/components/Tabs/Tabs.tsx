import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { Minus } from 'lucide-react';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { direction?: 'row' | 'column' }
>(({ className, direction = 'column', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      direction === 'row' ? "flex flex-row w-full items-start justify-start rounded-md bg-muted p-1 text-muted-foreground" : "flex flex-col h-full items-start justify-start rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    icon?: React.ReactNode;
    onClose?: () => void;
    isClosable?: boolean;
  }
>(({ className, icon, children, onClose, isClosable, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "group",
      className
    )}
    {...props}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
    {isClosable && (
      <Minus
        className="absolute -top-2 -right-2 invisible group-hover:visible h-4 w-4 text-red-800 rounded-full p-[2px] bg-red-100/80"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
      />
    )}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & { direction?: 'row' | 'column' }
>(({ className, direction = 'column', ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      direction === 'row' ? "flex-1 w-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" : "flex-1 h-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };