import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ReactNode, useState } from "react";

interface IModal {
  header?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  dialogPanelClass: string;
  dialogBackdropClassName?: string;
  ref?:
    | {
        current: {
          close?: Function;
          open?: Function;
          eleRef?: any;
        };
      }
    | any;
}

export default function Modal(props: IModal) {
  const {
    header,
    title,
    body,
    footer,
    dialogPanelClass,
    dialogBackdropClassName = "fixed inset-0 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in",
    ref,
  } = props;
  const [open, setOpen] = useState(true);

  if (ref) {
    ref.current["open"] = () => setOpen(true);
    ref.current["close"] = () => setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={() => {}}
      className="relative z-50 focus:outline-none"
      ref={ref?.current?.eleRef}
    >
      <DialogBackdrop transition className={dialogBackdropClassName} />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel transition className={dialogPanelClass}>
            {header}
            {title}
            {body}
            {footer}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
