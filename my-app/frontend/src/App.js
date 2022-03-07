import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'

import { ALL_AUTHORS } from './queries'
import { ALL_BOOKS, BOOK_ADDED } from './queries'

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const resultAuthors = useQuery(ALL_AUTHORS)
  // const resultAuthors = useQuery(ALL_AUTHORS, {
  //   pollInterval: 2000
  // })
  const resultBooks = useQuery(ALL_BOOKS)  

  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  

  useEffect(() => {
    const localStorageToken = window.localStorage.getItem('library-user-token') 
    if (localStorageToken !== null)
    {
      setToken(localStorageToken) 
    }
  }, [])

  const [page, setPage] = useState('authors')
  
  const updateCacheWith = (addedBook) => {
    console.log('addedBook ', addedBook)
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      //notify(`${addedBook.title} added`) 
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  if (resultAuthors.loading || resultBooks.loading)  {
    return <div>loading...</div>
  } 
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    window.location.href = '/'
  }

  const LoggingButtons = () => { 
    if (!token) {
      return (  
          <button onClick={() => setPage('login')}>login</button> 
      )
    }
    else
    {
      return ( 
       <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommended_books')}>recommended</button>
          <button  onClick={logout}>logout</button>
       </> 
      )
    }
  }

  const LoggedInUserFunctions = () => { 
    if (!token) {
      return ( 
        <></>
      )
    }
    else
    {
      return ( 
        <div>
        <NewBook
          show={page === 'add'}
        />   
      </div>
      )
    }
  }

  const LogInVisibility = () => { 
    if (!token && page === 'login') {
      return ( 
        <>
        <LoginForm show={page === 'login'}
        setToken={setToken}
        setError={notify}
      /> </>
      )
    }
    else
    {
      return ( 
        <></> 
      )
    }
  }


  const isUserLoggedIn = (token === null ? false  : true) 

  return (
    <div>
       <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <LoggingButtons></LoggingButtons>
      </div>

      <Authors
        show={page === 'authors'} authors={resultAuthors.data.allAuthors} setError={notify} isUserLoggedIn={isUserLoggedIn}
      />

      <Books
        show={page === 'books'} books={resultBooks.data.allBooks} filtering='all_books' isUserLoggedIn={isUserLoggedIn}
      /> 
       <Books
        show={page === 'recommended_books'} books={resultBooks.data.allBooks} filtering='recommended_books' isUserLoggedIn={isUserLoggedIn}
      /> 
      <LoggedInUserFunctions></LoggedInUserFunctions>
      <LogInVisibility></LogInVisibility>
    </div>
  )
}

export default App