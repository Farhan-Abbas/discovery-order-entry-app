import { useState, useEffect } from 'react'

const useApiData = () => {
  const [predefinedProducts, setPredefinedProducts] = useState({})
  const [exchangeRates, setExchangeRates] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPredefinedProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const products = await response.json()
        setPredefinedProducts(products)
        console.log("Products loaded:", products)
      } else {
        throw new Error(`Failed to fetch products: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching predefined products:", error)
      setError(error.message)
    }
  }

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch("/api/exchange-rates")
      if (response.ok) {
        const rates = await response.json()
        setExchangeRates(rates)
        console.log("Exchange rates loaded:", rates)
      } else {
        throw new Error(`Failed to fetch exchange rates: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
      setError(error.message)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      await Promise.all([
        fetchPredefinedProducts(),
        fetchExchangeRates()
      ])
      
      setLoading(false)
    }

    loadData()
  }, [])

  const retryLoad = () => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      await Promise.all([
        fetchPredefinedProducts(),
        fetchExchangeRates()
      ])
      
      setLoading(false)
    }

    loadData()
  }

  return { predefinedProducts, exchangeRates, loading, error, retryLoad }
}

export default useApiData
