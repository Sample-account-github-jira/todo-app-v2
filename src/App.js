import axios from 'axios';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem';

class App extends Component {
  constructor(){
    super(); //called immediately after constructor
    this.state = {
      newTodo: '', 
      editing: false,
      editingIndex: null,
      notification: null,
      todos: []
    };

    this.apiUrl = 'https://5cbf0d9806a6810014c662bf.mockapi.io';
    this.addTodo = this.addTodo.bind(this);
    //this.editTodo = this.editTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.alert = this.alert.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.handleChange =this.handleChange.bind(this);
    //this.generateTodoId = this.generateTodoId.bind(this);
  }

  componentWillMount(){ //lifecycle hooks
    console.log("I'll mounted");
  }

  async componentDidMount(){
    //console.log('I mounted');
    const response = await axios.get(`${this.apiUrl}/todos`);
    console.log(response);
    this.setState({
      todos: response.data
    });
  }

  handleChange(event){
    this.setState({ //bindign error mat arise i.e. setState is not defined
    newTodo: event.target.value
    });
    //console.log(event.target.name, event.target.value);
  }

  /*
  generateTodoId(){
    const lastTodo = this.state.todos[this.state.todos.lenght - 1];
    if(lastTodo){
      return lastTodo.id+1;
    }

    return 1;
  }*/

  async addTodo(){
    /*const newTodo={ 
      name: this.state.newTodo,
      id:this.generateTodoId()
      //if we delete all todos then thorow error as id will be zero
      //id: this.state.todos[this.state.todos.length - 1].id + 1
    };
    */
  
    const response = await axios.post(`${this.apiUrl}/todos`, {
    name: this.state.newTodo 
  });

  console.log(response);
  //state is immutable.
  //this.state.todos.push(newTodo);

  const todos = this.state.todos;
  //todos.push(newTodo);
  todos.push(response.data);
  
  this.setState({
    todos: todos,
    newTodo: ''
  });
  this.alert('Todo added successfully')
  }
  
  editTodo(index){
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    })
  }

  async updateTodo(){
    const todo =this.state.todos[this.state.editingIndex];
    
    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`,{
    name: this.state.newTodo
    });

    console.log(response);

    todo.name = this.state.newTodo;

    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;
    this.setState({
      todos, 
      editing: false, 
      editingIndex:null, 
      newTodo: '' 
    });
    this.alert('Todo updated successfully')
  }
 
  alert(notification){
    this.setState({
      notification
    });
  setTimeout(()=>{
    this.setState({
      notification: null
    });
  }, 2000);
 }
  async deleteTodo(index){
    //console.log(index);
    const todos =this.state.todos;
    const todo = this.state.todos[index];
   
    await axios.delete(`${this.apiUrl}/todos/${todo.id}`);
    delete todos[index];

    this.setState({todos});
    this.alert('Todo deleted successfully')
  }

  render(){
    //everytime state changes render function is called and to avoid that lifecyclehooks is useful
    //console.log(this.state.newTodo);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="appTitle">Todo Application</h1>
          
        </header>

        <div className="container">
          {
            this.state.notification &&
            <div className="alert mt-3 alert-success">
              <p className="text-center"> {this.state.notification}</p>
            </div>
          }
          <input 
          type= "text" 
          name= "todo"
          className="m-4 form-control" 
          placeholder="Add new todo"
          onChange={this.handleChange} //state value is binded input value and vice versa
          value={this.state.newTodo} 
          />
          <button 
          onClick={this.state.editing ? this.updateTodo : this.addTodo} //event list
          className="btn-success mb-3 form-control"
          disabled = {this.state.newTodo.length<5}
          >
            {this.state.editing ? 'Update todo' : 'Add todo'}
          </button>
         
          {
            !this.state.editing &&
            <ul className="list-group">
              { 
                this.state.todos.map((item, index)=>{ //[1,2,3,4].(item=>{return item+1;}))
                  return <ListItem
                    key={index.id}
                    item={item}
                    editTodo={()=>{this.editTodo(index); }}
                    deleteTodo={()=>{this.deleteTodo(index); }}
                  ></ListItem>
              })}
          </ul>

          }

          

        </div>
      </div>
    );
  }
}

export default App;
//inside ul tag <li className="list-group-item">ABC</li><li className="list-group-item">123</li><li className="list-group-item">XYZ</li><li className="list-group-item">456</li>