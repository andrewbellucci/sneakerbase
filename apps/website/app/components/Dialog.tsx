import * as RadixDialog from '@radix-ui/react-dialog';
import { PropsWithChildren } from "react";

interface DialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  trigger: JSX.Element;
}

export default function Dialog({ open, trigger, onOpenChange, children }: PropsWithChildren<DialogProps>) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>
        {trigger}
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={'fixed inset-0 bg-black/25 z-[100]'} />
        <RadixDialog.Content className={'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]'}>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
