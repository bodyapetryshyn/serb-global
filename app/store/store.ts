import {configureStore} from '@reduxjs/toolkit'
import reducer from '../reducer/reducer'

const store = configureStore({
    reducer:{
        products: reducer,
    },
    
})

export default store