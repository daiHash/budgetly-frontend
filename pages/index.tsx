import Button from '@material-ui/core/Button'
import { format } from 'date-fns'
import Head from 'next/head'
import Link from 'next/link'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import { ChartOptions, ExpensesChart } from '../components/Chart'
import { Modal } from '../components/Modal'
import { expenseTypesData } from '../components/Modal/AddExpense'
import { db } from '../utils/firebase'
import { undefinedToZero } from '../utils/undefinedToZero'
import { Expense } from './expenses/detail/[expenseGroupId]'

export default function Home() {
  const currentDate = useRef(format(new Date(), 'MM-yyyy'))
  const [allData, setAllData] = useState<Array<Expense[]> | undefined>(
    undefined
  )
  const [chartOptions, setChartOptions] = useState<ChartOptions>({})
  const [showChart, setShowChart] = useState(false)

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

  const [allExpenseGroupData, allExpenseGroupLoading, allExpenseGroupError] =
    useCollection(db.collection('expensesGroups').where('expense', '!=', null))

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

  const getAllExpensesGroups = useCallback(async () => {
    const result: any[] = []
    if (expensesGroups) {
      expensesGroups.forEach(async (data, i) => {
        const collection = await db
          .collection('expensesGroups')
          .doc(data.id)
          .collection('expenses')
          .get()

        result.push(
          collection.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
          })
        )
      })
    }

    return result
  }, [expensesGroups])

  const getChartSeriesData = useCallback(() => {
    if (!allData) return

    const seriesData: any[] = []
    const tmpData: any[] = []
    const tmpObj: any = {}

    allData.forEach((d, i) => {
      const obj: any = {}

      d.forEach((v) => {
        obj[v.type] = obj[v.type] ? obj[v.type] + v.amount : v.amount
      })

      tmpData.push(obj)
    })

    tmpData.forEach((d) => {
      for (const key of expenseTypesData) {
        if (tmpObj[key]) {
          tmpObj[key] = [...tmpObj[key], d[key]]
        } else {
          tmpObj[key] = [d[key]]
        }
      }
    })

    Object.keys(tmpObj).forEach((v) => {
      seriesData.push({ name: v, data: undefinedToZero(tmpObj[v]) })
    })

    return seriesData
  }, [allData])

  const getChartOptions = useCallback(async () => {
    const series = getChartSeriesData() as ChartOptions['series']
    setChartOptions({ categories: expensesGroups?.map((c) => c.id), series })
  }, [expensesGroups, allData])

  const showChartData = async () => {
    !showChart && (await getChartOptions())
    setShowChart((v) => !v)
  }

  useEffect(() => {
    if (!expenseGroupLoading && expensesGroups) {
      ;(async () => {
        return await getAllExpensesGroups()
      })().then((data) => {
        setAllData(data)
      })
    }
  }, [expensesGroups, expenseGroupLoading])

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
        <Title>Monthly Expenses</Title>
        <Button onClick={showChartData} color='primary'>
          Show Monthly Expenses Chart
        </Button>

        <MonthlyExpensesList>
          {expensesGroups &&
            expensesGroups.map((expense) => (
              <Fragment key={expense.id}>
                <li>
                  <Link href={`/expenses/detail/${expense.id}`}>
                    <a>📝 Expenses from: {expense.id} ↠</a>
                  </Link>
                </li>
              </Fragment>
            ))}
        </MonthlyExpensesList>
      </Main>

      <Modal
        toggleModal={showChartData}
        showModal={showChart}
        title='Monthly Expenses Chart'
      >
        <ExpensesChartContainer>
          <ExpensesChart options={chartOptions} />
        </ExpensesChartContainer>
      </Modal>

      <footer></footer>
    </Container>
  )
}

const Title = styled.h1`
  font-size: 3rem;
  margin: 0;
`

const Container = styled.div`
  padding: 0 10%;
  margin: 50px 0;
`

const Main = styled.main`
  width: 100%;
  max-width: 1200px;
  height: calc(100% - 64px);
`

const ExpensesContainer = styled.div`
  width: 80%;
  height: 50%;
`

const ExpensesChartContainer = styled.section`
  width: 100%;
  /* height: 50%; */
`

const MonthlyExpensesList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  width: 100%;
  box-sizing: border-box;

  > li {
    width: 100%;
    height: 85px;
    line-height: 85px;
    font-size: 2rem;
    padding: 0 10px;
    border-radius: 4px;
    box-sizing: border-box;
    transition: border 0.2s;
    margin: 10px 0;
    cursor: pointer;

    &:hover {
      border: 1px solid #ccc;
    }

    > a {
      box-sizing: border-box;
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
`
