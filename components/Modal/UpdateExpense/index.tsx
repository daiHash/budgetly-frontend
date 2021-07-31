import { Select } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import isEqual from 'lodash.isequal'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Expense } from '../../../pages/expenses/detail/[expenseGroupId]'
import { db } from '../../../utils/firebase'

type Props = {
  showModal: boolean
  toggleModal: () => void
  // addExpense: () => void
  currentDate: string
  currentExpense: Expense
}

export const expenseTypes = {
  FIXED: 'FIXED',
  MISCELLANEOUS: 'MISCELLANEOUS',
  FOOD: 'FOOD',
  HOUSING: 'HOUSING',
  UTILITIES: 'UTILITIES',
} as const

export const expenseTypesData = Object.keys(expenseTypes)

export const UpdateExpenseModal: React.FC<Props> = ({
  showModal,
  toggleModal,
  currentDate,
  currentExpense,
}) => {
  const initialValue = {
    name: currentExpense.name,
    type: currentExpense.type,
    amount: currentExpense.amount,
  }

  const [expense, setExpense] =
    useState<Omit<Expense, 'id' | 'createdAt'>>(initialValue)

  const updateExpense = useCallback(async () => {
    await db
      .collection('expensesGroups')
      .doc(currentDate)
      .collection('expenses')
      .doc(currentExpense.id)
      .update(expense)
    toggleModal()
  }, [currentExpense, expense])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value, name } = e.currentTarget

      setExpense((data) => ({ ...data, [name]: value }))
    },
    []
  )

  const onSelectOptionChange = useCallback(
    (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const { value, name = 'type' } = e.currentTarget

      setExpense((data) => ({ ...data, [name]: value }))
    },
    []
  )

  const disableButton = useMemo(() => {
    return isEqual(initialValue, expense)
  }, [expense])

  useEffect(() => {
    if (!showModal) {
      setExpense(initialValue)
    }
  }, [showModal])
  return (
    <Dialog
      open={showModal}
      onClose={toggleModal}
      aria-labelledby='form-dialog-title'
    >
      <div>
        <DialogTitle id='form-dialog-title'>Update expense</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin='dense'
            name='name'
            label='Expense Name'
            type='text'
            fullWidth
            onChange={onInputChange}
            required
            value={expense.name}
          />
          <Select
            required
            fullWidth
            native
            value={expense.type}
            onChange={onSelectOptionChange}
            inputProps={{
              name: 'type',
            }}
          >
            <option
              aria-label='None'
              placeholder='Add Expense Type...'
              value=''
            />
            {expenseTypesData.map((type, i) => (
              <option key={`${type}-${i}`} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <TextField
            margin='dense'
            name='amount'
            label='Expense Amount'
            type='number'
            value={expense.amount}
            fullWidth
            onChange={onInputChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal}>Cancel</Button>
          <Button
            onClick={updateExpense}
            color='primary'
            disabled={disableButton}
          >
            Update Expense
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}
