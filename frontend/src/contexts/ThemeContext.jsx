import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark'
  })

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  // Light theme configuration
  const lightTheme = {
    token: {
      colorPrimary: '#1890ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1890ff',
      borderRadius: 6,
      colorBgContainer: '#ffffff',
      colorBgLayout: '#f0f2f5',
      colorText: 'rgba(0, 0, 0, 0.88)',
      colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
      colorBorder: '#d9d9d9',
      colorBgElevated: '#ffffff',
      colorFillQuaternary: 'rgba(0, 0, 0, 0.02)',
      colorFillTertiary: 'rgba(0, 0, 0, 0.04)',
      colorFillSecondary: 'rgba(0, 0, 0, 0.06)',
      colorFill: 'rgba(0, 0, 0, 0.08)',
    },
    components: {
      Card: {
        borderRadiusLG: 8,
        colorBgContainer: '#ffffff',
        colorBorderSecondary: '#f0f0f0',
      },
      Button: {
        borderRadius: 6,
      },
      Layout: {
        colorBgHeader: '#ffffff',
        colorBgBody: '#f0f2f5',
      },
      Select: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
      },
      InputNumber: {
        colorBgContainer: '#ffffff',
        colorBorder: '#d9d9d9',
      },
      Table: {
        colorBgContainer: '#ffffff',
        colorFillAlter: '#fafafa',
        colorBorderSecondary: '#f0f0f0',
      },
      Form: {
        colorBgContainer: '#ffffff',
      },
      Statistic: {
        colorTextHeading: 'rgba(0, 0, 0, 0.88)',
        colorText: 'rgba(0, 0, 0, 0.88)',
      },
      Alert: {
        colorErrorBg: '#fff2f0',
        colorWarningBg: '#fffbe6',
        colorSuccessBg: '#f6ffed',
        colorInfoBg: '#e6f7ff',
      },
    },
  }

  // Dark theme configuration
  const darkTheme = {
    token: {
      colorPrimary: '#177ddc',
      colorSuccess: '#49aa19',
      colorWarning: '#d89614',
      colorError: '#d32029',
      colorInfo: '#177ddc',
      borderRadius: 6,
      colorBgContainer: '#141414',
      colorBgLayout: '#000000',
      colorText: 'rgba(255, 255, 255, 0.85)',
      colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
      colorBorder: '#424242',
      colorBgElevated: '#1f1f1f',
      colorFillQuaternary: 'rgba(255, 255, 255, 0.04)',
      colorFillTertiary: 'rgba(255, 255, 255, 0.08)',
      colorFillSecondary: 'rgba(255, 255, 255, 0.12)',
      colorFill: 'rgba(255, 255, 255, 0.18)',
    },
    components: {
      Card: {
        borderRadiusLG: 8,
        colorBgContainer: '#141414',
        colorBorderSecondary: '#424242',
      },
      Button: {
        borderRadius: 6,
        colorBgContainer: '#141414',
      },
      Layout: {
        colorBgHeader: '#141414',
        colorBgBody: '#000000',
        colorBgTrigger: '#1f1f1f',
      },
      Select: {
        colorBgContainer: '#141414',
        colorBorder: '#424242',
        optionSelectedBg: '#1f1f1f',
      },
      InputNumber: {
        colorBgContainer: '#141414',
        colorBorder: '#424242',
      },
      Table: {
        colorBgContainer: '#141414',
        colorFillAlter: '#1f1f1f',
        colorBorderSecondary: '#424242',
      },
      Form: {
        colorBgContainer: '#141414',
      },
      Statistic: {
        colorTextHeading: 'rgba(255, 255, 255, 0.85)',
        colorText: 'rgba(255, 255, 255, 0.85)',
      },
      Alert: {
        colorErrorBg: '#2a1215',
        colorWarningBg: '#2b2111',
        colorSuccessBg: '#162312',
        colorInfoBg: '#111b26',
      },
    },
  }

  const currentTheme = isDarkMode ? darkTheme : lightTheme

  const value = {
    isDarkMode,
    toggleTheme,
    currentTheme,
    lightTheme,
    darkTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
