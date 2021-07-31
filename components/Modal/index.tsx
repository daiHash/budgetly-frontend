import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import React from 'react'

type Props = {
  showModal: boolean
  toggleModal: () => void
  title?: string
}

export const Modal: React.FC<Props> = ({
  children,
  showModal,
  toggleModal,
  title,
}) => {
  return (
    <Dialog
      open={showModal}
      onClose={toggleModal}
      aria-labelledby='dialog-title'
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle id='dialog-title'>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  )
}
