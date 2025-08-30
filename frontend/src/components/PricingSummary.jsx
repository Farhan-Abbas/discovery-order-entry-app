import React from 'react'
import { Card, Statistic } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

const PricingSummary = ({ totalOrderPrice, currency }) => {
  const { isDarkMode } = useTheme()
  
  return (
    <Card 
      style={{ 
        marginTop: 24, 
        background: isDarkMode 
          ? 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none'
      }}
    >
      <Statistic
        title={<span style={{ color: '#fff', fontSize: 16 }}>Total Order Amount</span>}
        value={totalOrderPrice.toFixed(2)}
        precision={2}
        valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}
        prefix={<DollarOutlined style={{ color: '#fff' }} />}
        suffix={<span style={{ color: '#fff', fontSize: 20 }}>{currency}</span>}
      />
    </Card>
  )
}

export default PricingSummary
