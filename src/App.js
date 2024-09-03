// import { useEffect, useState } from 'react';
import About from './About';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import './index.css';
import Missing from './Missing';
import Nav from './Nav';
import NewPost from './NewPost';
import PostPage from './PostPage';
// import {format} from 'date-fns'
import { Route, Routes } from 'react-router-dom';
// import api from './api/posts'
import EditPost from './EditPost';
// import useWindowSize from './hooks/useWindowSize';
// import useAxiosFetch from './hooks/useAxiosFetch';
import { DataProvider } from './context/DataContext';


//This has examples of axios's get,post,put and delete
function App() {
  
  return (
    <div className="App">
      <DataProvider>
        <Header title="Social Media"/>
        <Nav />
        <Routes>
          <Route 
            path='/' 
            element={<Home />}
          /> 
          <Route path="post">
            <Route index element = {<NewPost />} 
          /> 
          <Route 
            path=':id' 
            element={<PostPage />}
          />
          </Route>
          <Route 
            path="/edit/:id" 
            element={<EditPost />} 
          />
          <Route
            path='about' element = {<About />} 
          />
          <Route
            path='*' element = {<Missing />} 
          />
        </Routes>
        <Footer />
      </DataProvider>
      
    </div>
  );
}

export default App;
