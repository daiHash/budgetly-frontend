import { format } from 'date-fns'
import Head from 'next/head'
import Link from 'next/link'
import React, { Fragment, useEffect, useMemo, useRef } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import { db } from '../utils/firebase'

export default function Home() {
  const currentDate = useRef(format(new Date(), 'MM-yyyy'))

  // const [expensesData, expensesLoading, expensesError] = useCollection<
  //   Omit<Expense, 'id'>
  // >(
  //   db
  //     .collection('expensesGroups')
  //     .doc(currentDate.current)
  //     .collection('expenses'),
  //   {}
  // )
  const [expenseGroupData, expenseGroupLoading, expenseGroupError] =
    useCollection(db.collection('expensesGroups'))

  const [
    latestExpenseGroupData,
    latestExpenseGroupLoading,
    latestExpenseGroupError,
  ] = useCollection(
    db.collection('expensesGroups').where('name', '==', currentDate.current)
  )

  // const expenses = useMemo<Expense[] | undefined>(() => {
  //   return expensesData?.docs.map((doc) => {
  //     return { id: doc.id, ...doc.data() }
  //   })
  // }, [expensesData])

  const expensesGroups = useMemo(() => {
    return expenseGroupData?.docs.map((doc) => {
      return { id: doc.id, ...doc.data() }
    })
  }, [expenseGroupData])

  // Add new expensesGroup if doesn't exist. ie: if its a new month
  useEffect(() => {
    if (!latestExpenseGroupLoading && !latestExpenseGroupData?.docs[0]) {
      db.collection('expensesGroups')
        .doc(currentDate.current)
        .set({ name: currentDate.current })
    }
  }, [latestExpenseGroupData, latestExpenseGroupLoading])

  return (
    <Container>
      <Head>
        <title>Budgetly</title>
        <meta name='description' content='Budgetly' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Main>
        <Title>Budgetly</Title>
        <ul>
          {expensesGroups &&
            expensesGroups.map((expense) => (
              <Fragment key={expense.id}>
                <li>
                  <Link href={`/expenses/detail/${expense.id}`}>
                    <a>Expenses: {expense.id}</a>
                  </Link>
                </li>
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
