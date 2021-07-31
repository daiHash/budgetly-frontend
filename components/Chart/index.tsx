import dynamic from 'next/dynamic'
import React from 'react'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export type ChartOptions = {
  categories?: string[]
  series?: Array<{ name: string; data: Array<number | undefined> }>
}

export const ExpensesChart: React.FC<{ options: ChartOptions }> = ({
  options: { categories = [], series },
}) => {
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: '100%',
    } as const,
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          } as const,
        },
      },
    ],
    xaxis: {
      categories,
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'right',
      offsetX: 0,
      offsetY: 50,
    } as const,
  }

  return <Chart options={options} series={series} type='bar' />
}
