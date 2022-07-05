import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Card, Alert} from 'react-bootstrap'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Link } from 'react-router-dom';
import {SERVER_URL} from '../config/config'
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/Navbar";

const Profile = () => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [postTitle, setPostTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);
    const [postBtnText, setPostBtnText] = useState('post');
    const [alertType, setAlertType] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get(SERVER_URL+'users/token');
            setToken(response.data.accessToken);
            setIsLoaded(true);
            const decoded = jwt_decode(response.data.accessToken);
            //console.log('Token',response.data.accessToken);
            setUserId(decoded.userId)
            setName(decoded.name);
            setExpire(decoded.exp);
            
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(SERVER_URL+'users/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });


    const savePost = async (e) => {
        e.preventDefault();
        resetAlert()
        let valid = true;
        if(postTitle == ""){
            valid = false;
            setAlertType('danger');
            setAlertMessage("Post title is required");
        }
        if(postText == ""){
            valid = false;
            setAlertType('danger');
            setAlertMessage("Post content is required");
        }

        if(valid){
            setPostBtnText('Posting...');
            const response = await axios.post(SERVER_URL+'posts/save', {
                postTittle: postTitle,
                content: postText,
                userId: userId
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if(response.status == 200){
                setPostBtnText('Post');
                const data = response.data;
                if(data.success){
                    setPostTitle('');
                    setPostText('');
                    setAlertType('success');
                    setAlertMessage(data.message);
                    setTimeout(resetAlert, 4000);
                    //refresh post
                    getPosts();
                }
                else{
                    setAlertType('danger');
                    setAlertMessage(data.message);
                }
            }
            else{
                setPostBtnText('Post');
                setAlertType('danger');
                setAlertMessage("Failed internal server error");
                setTimeout(resetAlert, 4000);
            }

        }   

    }

    const resetAlert = ()=>{
        setAlertType(false);
        setAlertMessage("");
    }

    const getPosts = async () =>{
        //console.log('Bear token',token);
        //get user post
        const response = await axios.post(SERVER_URL+'posts/user', {userId: userId }, 
        {
            headers: {
            Authorization: `Bearer ${token}`
        }
        });
        setPosts(response.data.posts);
    }

    if(isLoaded){
        //console.log('Token is ready');
        setIsLoaded(false);
        getPosts();
    }

    return (
        <>
            <NavBar/>
            <Container>
                <Row className="justify-content-md-center">
                    <Col sm={12} md={8} xl={6}>
                        <div className="post-card mt-3">
                            <Card.Body>
                                <Card.Title className="text-center">New post</Card.Title>
                                {alertType && 
                                    <Alert variant={alertType} className="no-border">
                                        {alertMessage}
                                    </Alert>
                                }
                                <form onSubmit={savePost}>
                                    <div className="mb-3">
                                        <label className="form-label">Title</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Post title"
                                            value={postTitle} 
                                            onChange={(e) => setPostTitle(e.target.value)}/>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Content</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="3" 
                                            placeholder="Post content"
                                            value={postText} 
                                            onChange={(e) => setPostText(e.target.value)}
                                            >
                                        </textarea>
                                    </div>
                                    <Row className="justify-content-center">
                                        <Col md="12" sm="12">
                                            <button type="submit" className="btn btn-primary" >{postBtnText}</button>
                                        </Col>
                                    </Row>
                                </form>
                            </Card.Body>
                        </div>
                    </Col>
                </Row>
                {posts.length === 0 &&
                    <Row className="justify-content-md-center">
                        <Col sm={12} md={8} xl={6} >
                            <div className="post-card mt-3">
                                <Card.Body>
                                    <Card.Title className="text-center">You have 0 posts</Card.Title>
                                </Card.Body>
                            </div> 
                        </Col>
                    </Row>
                }
                {posts.map((post, index) => (
                    <Row className="justify-content-md-center" key={index}>
                        <Col sm={12} md={8} xl={6} >
                            <div className="post-card mt-3">
                                <Card.Body>
                                    <Card.Title>{post.postTittle}</Card.Title>
                                    <Card.Text>{post.content}</Card.Text>
                                </Card.Body>
                            </div>  
                        </Col>
                    </Row>         
                
                ))}
                
            </Container>
        </>
    )
}
export default Profile;