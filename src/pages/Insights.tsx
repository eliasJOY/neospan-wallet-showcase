import SpendingInsightCard from '@/components/SpendingInsightCard'
import BottomNavBar from '@/components/ui/bottom-navbr'
import React from 'react'

const Insights = () => {
  return (
    <div className="mb-6 bg-white">
      <SpendingInsightCard />

      <BottomNavBar />
    </div>
  )
}

export default Insights