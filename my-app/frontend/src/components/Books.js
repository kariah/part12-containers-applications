/* eslint-disable react/prop-types */

import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { ME } from '../queries'
import { ALL_BOOKS_BY_GENRE } from '../queries'

const Books = (props) => {
  const [books, setBooks] = useState('')  
  const [getBooks, resultBooks] = useLazyQuery(ALL_BOOKS_BY_GENRE)  
  
  const isUserLoggedIn = props.isUserLoggedIn
  const resultMe = useQuery(ME, { 
    skip: !isUserLoggedIn
  })
 
  //testaa
  const showBooks = (genre) => { 
    getBooks({ variables: { genre: genre } })
  }

  useEffect(() => {
    if (resultBooks.data) {
      console.log('resultBooks.data.allBooks ', resultBooks.data.allBooks)
      setBooks(resultBooks.data.allBooks)
    }
  }, [resultBooks])
  
  const filtering = props.filtering
  
  useEffect(() => {
    setBooks(props.books)
  }, [props.books]) 

  if (resultMe.loading)  {
    return <div>loading...</div>
  } 
 
  if (!props.show) {
    return null
  }   
 
  const PageTitle = () => { 
    if (!isUserLoggedIn || filtering === 'all_books') {
      return ( 
        <>
         <h2>books</h2>
       </>
      )
    }
    else
    {
      return ( 
        <>
         <h2>recommendations</h2>
         <div>
             books in your favourite genre <b>{resultMe.data.me.favoriteGenre}</b>
         </div>
        </> 
      )
    }
  }

  return (
    <div>
      <PageTitle></PageTitle>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {/*  TODO: Voisi muodostua dynaamisesti! */}
      <div>
        <button onClick={() => showBooks('refactoring')}>refactoring</button>
        <button onClick={() => showBooks('agile')}>agile</button>
        <button onClick={() => showBooks('patterns')}>patterns</button>
        <button onClick={() => showBooks('design')}>design</button>
        <button onClick={() => showBooks('crime')}>crime</button>
        <button onClick={() =>showBooks('classic')} >classic</button>
        <button onClick={() => showBooks('')}>allgenres</button>
      </div>
    </div>
  )
}

export default Books