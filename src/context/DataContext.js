import { createContext } from "react"
import { useEffect, useState } from 'react';
import '../index.css';
import {format} from 'date-fns'
import { useNavigate } from 'react-router-dom';
import api from '../api/posts'
import useWindowSize from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({})

export const DataProvider = ({children}) => {

    const[posts,setPosts]=useState([])
    const[search,setSearch]=useState('')
    const[searchResults,setSearchResults]=useState([])
    const[postTitle,setPostTitle]=useState('')
    const[postBody,setPostBody]=useState('')
    const[editBody,setEditBody]=useState('')
    const[editTitle,setEditTitle]=useState('')
    const navigate=useNavigate()
    const{width}=useWindowSize()

    //For fetching posts using Axios API but with custom hook.
    const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3010/posts')
    useEffect(()=>{
        setPosts(data)
    }, [data])

    //For Searching posts
    useEffect(() => {
        const filteredResults = posts.filter((post) => ((post.body).toLowerCase()).includes(search.toLowerCase())
        || ((post.title).toLowerCase()).includes(search.toLowerCase()));

        setSearchResults(filteredResults.reverse());
    }, [posts, search])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const id=posts.length ? posts[posts.length-1].id + 1 : 1;
        const datetime= format(new Date(), 'MMMM dd, yyyy pp')
        const newPost={id, title : postTitle, datetime, body: postBody};
        try{
        const response = await api.post('/posts',newPost)
        const allPosts = [...posts, response.data]
        setPosts(allPosts)
        setPostTitle('')
        setPostBody('')
        navigate('/')
        } catch (err){
            if(err.response){
            //Not in 200 response range 
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            }else{
            console.log(`Error: ${err.message}`);
            }
        }
    }

    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = { id, title: editTitle, datetime, body: editBody };
        try {
        const response = await api.put(`/posts/${id}`, updatedPost);
        setPosts(posts.map(post => post.id === id ? {...response.data} : post));
        setEditTitle('');
        setEditBody('');
        navigate('/');
        } catch (err) {
        console.log(`Error: ${err.message}`);
        }
    }

    const handleDelete = async (id) => {
        try{
        await api.delete(`posts/${id}`)
        const postsList = posts.filter(post => post.id !== id);
        setPosts(postsList)
        navigate('/')
        } catch(err){
        if(err.response){
            //Not in 200 response range 
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
        }else{
            console.log(`Error: ${err.message}`);
        }
        }
    }

    return (
        <DataContext.Provider value={{
            width, posts, fetchError, isLoading, search,setSearch, handleSubmit, postTitle,postBody, setPostTitle, setPostBody, handleDelete, searchResults, handleEdit, editBody, setEditBody, editTitle, setEditTitle
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext