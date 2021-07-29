import Head from 'next/head'
import React, { Fragment, useMemo } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import firebase, { db } from '../utils/firebase'

type Expense = {
  id: string
  name: string
  value: number
  createdAt: string
}

export default function Home() {
  const [expensesData, expensesLoading, expensesError] = useCollection<
    Omit<Expense, 'id'>
  >(db.collection('expenses'), {})

  const addExpense = async () => {
    await db.collection('expenses').add({
      name: 'water bill',
      value: 7300,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  }

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

  return (
    <Container>
      <Head>
        <title>Budgetly</title>
        <meta name='description' content='Budgetly' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Main>
        <Title>Budgetly</Title>
        <button onClick={addExpense}>Add expense</button>

        <ul>
          {expenses &&
            expenses.map((expense, i) => (
              <Fragment key={expense.id}>
                <li>{expense.name}</li>
                <button onClick={() => onDelete(expense.id)}>Delete</button>
                <button onClick={() => onUpdate(expense.id)}>Update</button>
              </Fragment>
            ))}
        </ul>
      </Main>

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
  padding: 5rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
