import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
declare const Drawer: {
    ({ shouldScaleBackground, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const DrawerTrigger: React.ComponentType<React.ComponentProps<typeof DrawerPrimitive.Trigger>>;
declare const DrawerPortal: typeof import("vaul").Portal;
declare const DrawerClose: React.ComponentType<React.ComponentProps<typeof DrawerPrimitive.Close>>;
declare const DrawerOverlay: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Overlay>>>;
declare const DrawerContent: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Content>>>;
declare const DrawerHeader: {
    ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const DrawerFooter: {
    ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const DrawerTitle: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> & React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Title>>>;
declare const DrawerDescription: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> & React.RefAttributes<React.ElementRef<typeof DrawerPrimitive.Description>>>;
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, };
