import { Select } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
// import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { format } from 'date-fns'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Expense } from '../../../pages/expenses/detail/[expenseGroupId]'
import { db } from '../../../utils/firebase'

type Props = {
  showModal: boolean
  toggleModal: () => void
  // addExpense: () => void
  currentDate: string
}

const expenseTypes = {
  FIXED: 'FIXED',
  MISCELLANEOUS: 'MISCELLANEOUS',
  FOOD: 'FOOD',
  HOUSING: 'HOUSING',
  UTILITIES: 'UTILITIES',
} as const

const expenseTypesData = Object.keys(expenseTypes)

const initialValue: Omit<Expense, 'id'> = {
  name: '',
  type: '',
  amount: 0,
  createdAt: '',
}

export const AddExpenseModal: React.FC<Props> = ({
  showModal,
  toggleModal,
  currentDate,
}) => {
  const [expense, setExpense] = useState<Omit<Expense, 'id'>>(initialValue)

  const addExpense = useCallback(async () => {
    await db
      .collection('expensesGroups')
      .doc(currentDate)
      .collection('expenses')
      .add({
        ...expense,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      })
    toggleModal()
  }, [expense])

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
    return !expense.name || !expense.amount || !expense.type
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
        <DialogTitle id='form-dialog-title'>Add new expense</DialogTitle>
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
          <Button onClick={toggleModal} color='primary'>
            Cancel
          </Button>
          <Button onClick={addExpense} color='primary' disabled={disableButton}>
            Add Expense
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}
