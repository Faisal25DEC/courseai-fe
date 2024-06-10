import React from "react";

const useDisclosure = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return { isOpen, onOpen, onClose, setIsOpen };
};

export default useDisclosure;
