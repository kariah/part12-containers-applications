const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')

const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const mongoose = require('mongoose')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const JWT_SECRET = '7bihDTVK93ljVUBc2MWW'

const MONGODB_URI = 'mongodb+srv://fullstack:3fXMiNhiDLZGqYxT@cluster0.hjz9y.mongodb.net/library?retryWrites=true'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })


const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    id: String!
    bookCount: Int!
  }
 
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    booksCount: Int!,
    authorsCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
      addBook(
        title: String!
        author: String
        published: Int!
        genres: [String!]
      ): Book 
      editAuthor( 
        name: String!
        setBornTo: Int!
      ): Author

      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
  }

  type Subscription {
      bookAdded: Book!
  }    

`

const resolvers = {
    Query: {
        booksCount: () => Book.collection.countDocuments(),
        authorsCount: () => Author.collection.countDocuments(),
        allBooks: async (root, args) => { 
            if (args.genre) {
                return await Book.find({ genres: { $in: [args.genre] } }).populate('author', { name: 1 })
            }
            else {
                return await Book.find().populate('author', { name: 1 })
            }
        },
        allAuthors: async (root) => {
            return Author.find().populate('books')
        },
        me: (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }
            return currentUser
        }
    },
    Author: {
        bookCount: async (root) => {
            console.log('root ', root)
            return root.books.length

            // const booksByAuthor = await Book.find({ author: root.id }) 
            // console.log('booksByAuthor ', booksByAuthor)
            // console.log('root.book ', root)
 
            // return booksByAuthor.length
        } 
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            const book = new Book({ ...args })

            try {
                let author = await Author.findOne({ name: args.author }) 

                if (!author) {    
                    author = new Author({ ...args, name: args.author, books: book })  
                    book.author = author  
                } 
                else
                {    
                    book.author = author  
                    if (author.books === undefined || author.books === null)
                    { 
                        author.books = [book] 
                    }
                    else
                    {  
                        author.books = author.books.concat(book) 
                    }   
                } 
                 
                await book.save() 
                await author.save() 
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }

            pubsub.publish('BOOK_ADDED', { bookAdded: book })

            return book
        },

        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser

            if (!currentUser) {
                throw new AuthenticationError("not authenticated")
            }

            const author = await Author.findOne({ name: args.name })
            author.born = args.setBornTo

            try {
                await author.save()
                return author
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
        },

        createUser: (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

            return user.save()
                .catch(error => {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new UserInputError("wrong credentials")
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            const token = jwt.sign(userForToken, JWT_SECRET)

            console.log('token ', token)

            return { value: token }
        },
    },
    Subscription: { 
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {

        const auth = req ? req.headers.authorization : null

        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(
                auth.substring(7), JWT_SECRET
            )

            const currentUser = await User
                .findById(decodedToken.id)
            return { currentUser }
        }
    }
})

// server.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})
