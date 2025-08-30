import React from 'react'
import { Switch, Space, Typography } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '../contexts/ThemeContext'

const { Text } = Typography

const ThemeToggle = ({ style = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <div style={{ display: 'flex', alignItems: 'center', ...style }}>
      <Space size="small">
        <SunOutlined 
          style={{ 
            fontSize: 16, 
            color: !isDarkMode ? '#faad14' : '#8c8c8c',
            transition: 'color 0.3s ease'
          }} 
        />
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          size="default"
          style={{
            backgroundColor: isDarkMode ? '#1890ff' : '#d9d9d9',
          }}
          checkedChildren={<MoonOutlined style={{ fontSize: 12 }} />}
          unCheckedChildren={<SunOutlined style={{ fontSize: 12 }} />}
        />
        <MoonOutlined 
          style={{ 
            fontSize: 16, 
            color: isDarkMode ? '#1890ff' : '#8c8c8c',
            transition: 'color 0.3s ease'
          }} 
        />
        <Text 
          style={{ 
            fontSize: 13, 
            marginLeft: 8,
            opacity: 0.8,
            transition: 'opacity 0.3s ease'
          }}
        >
          {isDarkMode ? 'Dark' : 'Light'}
        </Text>
      </Space>
    </div>
  )
}

export default ThemeToggle
