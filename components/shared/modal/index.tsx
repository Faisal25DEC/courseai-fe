import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  showIcon?: boolean;
  showIconTop?: string;
  showIconRight?: string;
  className?: string;
}

const Modal = ({
  children,
  isOpen,
  onClose,
  className,
  showIcon,
  showIconTop,
  showIconRight,
}: ModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent
      className={`outline-none p-0 max-w-[1000px] w-[1000px] !rounded-[20px] ${className}`}
    >
      {children}
    </DialogContent>
  </Dialog>
);
export default Modal;
