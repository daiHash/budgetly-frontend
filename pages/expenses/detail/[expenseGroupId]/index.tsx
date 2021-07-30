import { DataGrid, GridColDef } from '@material-ui/data-grid'
import Skeleton from '@material-ui/lab/Skeleton'
import { format } from 'date-fns'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import { AddExpenseModal } from '../../../../components/Modal/AddExpense'
import { db } from '../../../../utils/firebase'

export type Expense = {
  id: string
  name: string
  amount: number
  type: string
  createdAt: string
}

export default function ExpenseDetail() {
  const router = useRouter()
  const expenseGroupId = useRef(router.query.expenseGroupId as string)
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false)

  const [expensesData, expensesLoading, expensesError] = useCollection<
    Omit<Expense, 'id'>
  >(
    db
      .collection('expensesGroups')
      .doc(expenseGroupId.current)
      .collection('expenses'),
    {}
  )
  // const [expenseGroupData, expenseGroupLoading, expenseGroupError] =
  //   useCollection(
  //     db.collection('expensesGroups').where('name', '==', expenseGroupId)
  //   )

  const addExpense = useCallback(async () => {
    await db
      .collection('expensesGroups')
      .doc(expenseGroupId.current)
      .collection('expenses')
      .add({
        name: 'water bill',
        amount: 7300,
        type: 'FIXED',
        createdAt: format(new Date(), 'MM-yyyy'),
      })
  }, [])

  const columns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Expense',
      width: 150,
      editable: false,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      editable: false,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: false,
    },
    {
      field: 'createdAt',
      headerName: 'createdAt',
      width: 150,
      editable: false,
    },

    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${params.getValue(params.id, 'firstName') || ''} ${
    //       params.getValue(params.id, 'lastName') || ''
    //     }`,
    // },
  ]

  const onDelete = async (id: string) => {
    await db.collection('expenses').doc(id).delete()
  }

  const onUpdate = async (id: string) => {
    await db.collection('expenses').doc(id).update({ name: 'water bill' })
  }

  const expenses = useMemo<Expense[] | undefined>(() => {
    return expensesData?.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }
    })
  }, [expensesData])

  // const expensesGroups = useMemo(() => {
  //   return expenseGroupData?.docs.map((doc) => {
  //     return { id: doc.id, ...doc.data() }
  //   })
  // }, [expenseGroupData])

  const toggleAddExpenseModal = useCallback(() => {
    setShowAddExpenseModal((v) => !v)
  }, [])

  // Add new expensesGroup if doesn't exist. ie: if its a new month
  // useEffect(() => {
  //   if (!expenseGroupLoading && !expenseGroupData?.docs[0]) {
  //     db.collection('expensesGroups')
  //       .doc(expenseGroupId.current)
  //       .set({ name: expenseGroupId.current })
  //   }
  // }, [expenseGroupData, expenseGroupLoading])

  return (
    <Container>
      <Head>
        <title>Budgetly</title>
        <meta name='description' content='Budgetly' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Main>
        <Title>Budgetly</Title>
        <button onClick={toggleAddExpenseModal}>Add expense</button>
        <ExpensesContainer>
          {expensesLoading ? (
            <Skeleton variant='rect' width='100%' height='100%'>
              <div style={{ paddingTop: '57%' }} />
            </Skeleton>
          ) : (
            expenses && (
              <DataGrid
                rows={expenses}
                columns={columns}
                pageSize={10}
                checkboxSelection
                disableSelectionOnClick
              />
            )
          )}
        </ExpensesContainer>
        {/* <ul>
          {expenses &&
            expenses.map((expense, i) => (
              <Fragment key={expense.id}>
                <li>{expense.name}</li>
                <button onClick={() => onDelete(expense.id)}>Delete</button>
                <button onClick={() => onUpdate(expense.id)}>Update</button>
              </Fragment>
            ))}
        </ul> */}
      </Main>
      <AddExpenseModal
        showModal={showAddExpenseModal}
        toggleModal={toggleAddExpenseModal}
        currentDate={expenseGroupId.current}
      />

      <footer></footer>
    </Container>
  )
}

const Title = styled.h1`
  font-size: 2rem;
  color: palevioletred;
`

const Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Main = styled.main`
  /* padding: 5rem 0;
  flex: 1; */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ExpensesContainer = styled.div`
  width: 80%;
  height: 50%;
`
