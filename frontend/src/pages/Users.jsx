import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

export const Users = () => {

    const [state, setState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        message: '',
        users: [],
        sort: '',
        search : '',
        editing: false,
        id: ''
    });

    const clearForm = (editing=false) => {
        setState({
            ...state,
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            message: '',
            sort : '',
            search : '',
            editing,
        })
    }

    const searchUser = async () => {
        const filter = JSON.stringify({
                [state.sort]: state.search
            }) 
        const response = await fetch(`${API_URL}/users`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: filter  
        }).then(res => res.json());
        setState({...state, users: response, editing: false});
    }

    const getUsers = async () => {
        const response = await fetch(`${API_URL}/users`).then(res => res.json());
        setState({...state, users: response, editing: false});
    }

    const createUser = async () => {
        // const userResponse = window.confirm('Are you sure you want to create this user?');
        // if(!userResponse) return;
        const response = await fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: state.first_name,
                last_name: state.last_name,
                email: state.email,
                phone: state.phone,
                message: state.message
            })
        }).then(res => res.json());
    }

    const deleteUser = async (id) => {
        // const userResponse = window.confirm('Are you sure you want to delete this user?');
        // if(!!userResponse){
            await fetch(`${API_URL}/user/${id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
                
            });
            await getUsers();
        // }
    }

    const editUser = async (id) => {

        const { user } = await fetch(`${API_URL}/user/${id}`).then(res => res.json());
        setState({
            ...state,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            message: user.message,
            id: id,
            editing: true
        });

    }

    useEffect(() => {
        getUsers()
    }, []);

    const updateUser = async () => {
        const { id } = state;
        const response = await fetch(`${API_URL}/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: state.first_name,
                last_name: state.last_name,
                email: state.email,
                phone: state.phone,
                message: state.message
            })      
        }).then(res => res.json());
    }

    const sendemail = async () => {
        await fetch(`${API_URL}/sendemail`).then(res => res.json());
        window.alert('Email sent successfully');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!state.editing){
            await createUser();
        }else{
           await updateUser();
        }
        await getUsers();
    }

    return (
        <>
            <div className="container">
                <div className="row justify-content-around">
                    <div className="col-sm-3">
                        <div className="row">
                        <form onSubmit={handleSubmit} className="card card-body">
                            <div className="my-2">
                                <input 
                                    type="text" 
                                    value={state.first_name}
                                    onChange={(e) => setState({ ...state, first_name: e.target.value})}
                                    className="form-control"
                                    placeholder="First Name"
                                    autoFocus
                                />
                            </div>
                            <div className="my-2">
                                <input
                                    type="text"
                                    value={state.last_name}
                                    onChange={(e) => setState({ ...state, last_name: e.target.value })}
                                    className="form-control"
                                    placeholder="Last Name"
                                    autoFocus
                                />
                            </div>
                            <div className="my-2">
                                <input 
                                    type="email" 
                                    value={state.email}
                                    onChange={(e) => setState({...state, email: e.target.value})}
                                    className="form-control"
                                    placeholder="Email"
                                    autoFocus
                                />
                            </div>
                            <div className="my-2">
                                <input
                                    type="text"
                                    value={state.phone}
                                    onChange={(e) => setState({ ...state, phone: e.target.value })}
                                    className="form-control"
                                    placeholder="Phone"
                                    autoFocus
                                />
                            </div>
                                <div className="my-2">
                                    <input
                                        type="text"
                                        value={state.message}
                                        onChange={(e) => setState({ ...state, message: e.target.value })}
                                        className="form-control"
                                        placeholder="Message"
                                        autoFocus
                                    />
                                </div>
                            <button 
                                type="submit"
                                className={`btn ${state.editing ? 'btn-info': 'btn-success'} mt-4`}
                            >
                                {state.editing ? 'EDIT': 'CREATE'}
                            </button>
                        </form>
                        </div>
                        <div className="row">
                            <button
                                onClick={() => sendemail()}
                                className="btn btn-warning btn-block mt-4"
                            >
                                Send Email to all users
                            </button>
                        </div>    
                    </div>
                    <div className="col-sm-9">
                        <div className="card card-body">
                            <div className="row justify-content-around">  
                                <div className="col-sm-3">
                                        <select 
                                            className="form-select" 
                                            aria-label="Default select example" 
                                            value={state.sort}
                                            onChange={(e) => setState({ ...state, sort: e.target.value })} 
                                        >
                                            <option selected>Sort by</option>
                                            <option value="first_name">FirstName</option>
                                            <option value="last_name">LastName</option>
                                            <option value="email">Email</option>
                                            <option value="phone">Phone</option>
                                        </select>
                                          
                                </div>     
                                <div className="col-sm-9">
                                    <div className="input-group">   
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Enter a filed name to search" 
                                            aria-label="Search" 
                                            aria-describedby="button-addon2"
                                            value={state.search}
                                            onChange={(e) => setState({ ...state, search: e.target.value })}
                                        />
                                        <button 
                                            className="btn btn-success btn-sm btn-block"
                                            type="button" 
                                            id="button-addon2"
                                            onClick={() => searchUser()}
                                        >
                                            Search
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm btn-block" 
                                            type="button" 
                                            id="button-addon2"
                                            onClick={() => window.location.reload(false)}
                                        >
                                            clear
                                        </button>
                                    </div>       
                                </div>
                            </div>
                        </div>
                        <div className="row"> 
                            <div className="card card-body">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Message</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {state.users.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>{user.first_name + " " + user.last_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.message}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-info btn-sm btn-block"
                                                    onClick={() => editUser(user._id)}
                                                >Edit</button>
                                                <button 
                                                    onClick={() => deleteUser(user._id)}
                                                    className="btn btn-danger btn-sm btn-block"
                                                >Delete</button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>        
                    </div>
                </div>
            </div>
        </>
    )
}