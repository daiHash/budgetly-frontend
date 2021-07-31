import Button from '@material-ui/core/Button'
import { DataGrid, GridColDef } from '@material-ui/data-grid'
import DeleteIcon from '@material-ui/icons/Delete'
import Skeleton from '@material-ui/lab/Skeleton'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import Link from 'next/link'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import { AddExpenseModal } from '../../../../components/Modal/AddExpense'
import { UpdateExpenseModal } from '../../../../components/Modal/UpdateExpense'
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
  const [showUpdateExpenseModal, setShowUpdateExpenseModal] = useState(false)
  const [currentExpense, setCurrentExpense] = useState<Expense | undefined>(
    undefined
  )

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

  const onDelete = useCallback(async (id: string) => {
    await db
      .collection('expensesGroups')
      .doc(expenseGroupId.current)
      .collection('expenses')
      .doc(id)
      .delete()
  }, [])

  const toggleAddExpenseModal = useCallback(() => {
    setShowAddExpenseModal((v) => !v)
  }, [])

  const toggleUpdateExpenseModal = useCallback(() => {
    setShowUpdateExpenseModal((v) => !v)
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
    {
      field: '',
      headerName: 'Update / Delete',
      editable: false,
      sortable: false,
      width: 200,
      // disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant='contained'
              color='primary'
              onClick={(e) => {
                e.stopPropagation()
                setCurrentExpense(params.row as Expense)
                toggleUpdateExpenseModal()
                console.log(params)
              }}
              style={{ marginRight: '10px' }}
            >
              Update
            </Button>
            <Button
              onClick={() => onDelete(params.id as string)}
              variant='contained'
              color='secondary'
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </>
        ) as React.ReactNode
      },
    },
    // {
    //   field: '',
    //   headerName: 'Remove',
    //   editable: false,
    //   sortable: false,
    //   width: 150,
    //   // disableClickEventBubbling: true,
    //   renderCell: (params) => {
    //     return (
    //       <Button
    //         onClick={() => onDelete(params.id as string)}
    //         variant='contained'
    //         color='secondary'
    //         startIcon={<DeleteIcon />}
    //       >
    //         Delete
    //       </Button>
    //     ) as React.ReactNode
    //   },
    // },

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
        <Link href={`/`}>
          <a>↞ Go back to Top</a>
        </Link>
        <Title>{expenseGroupId.current} Expenses:</Title>
        <Button color='primary' onClick={toggleAddExpenseModal}>
          Add Expense
        </Button>
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
                // checkboxSelection
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
      {currentExpense && showUpdateExpenseModal && (
        <UpdateExpenseModal
          showModal={showUpdateExpenseModal}
          toggleModal={toggleUpdateExpenseModal}
          currentDate={expenseGroupId.current}
          currentExpense={currentExpense}
        />
      )}
    </Container>
  )
}

const Title = styled.h1`
  font-size: 3rem;
`

const Container = styled.div`
  margin: 50px 0;
  padding: 0 10%;
`

const Main = styled.main`
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 164px);
`

const ExpensesContainer = styled.div`
  width: 100%;
  height: 60%;
`
