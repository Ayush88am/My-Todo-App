
const formHiddenFalse = () => {
  document.querySelector('.form').classList.remove('hide');
  document.querySelector('.result').innerText = 'Enter your TODO details below';
  document.querySelector('.result').style.color = 'black';
};








document.querySelector('#Add-TODO').addEventListener('click',()=>{
  document.querySelector('.Add-TODO-data').classList.remove('hide')
  document.querySelectorAll('.todo-item,.todoes-list,.todo-item-completed,.completed-todoes-list,.content,.empty-todo').forEach((item)=>{
item.classList.add('hide')
  })
})



document.getElementById('submit-todo').addEventListener('click', async function () {


  const todo = {
    name: document.getElementById('todo-name').value,
    date: document.getElementById('todo-date').value,
    time: document.getElementById('todo-time').value,
  };

  if (!todo.name || !todo.date || !todo.time) {
    document.querySelector('.result').innerText = 'All fields are required!';
    document.querySelector('.result').style.color = 'red';
    setTimeout(() => {
      formHiddenFalse();
    }, 2000);
    return;
  }

  const response = await fetch('http://localhost:3000/addTodo', {
    method: 'POST',
    body: JSON.stringify({
      todoName: todo.name,
      todoDate: todo.date,
      todoTime: todo.time,
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  if (response.ok) {
    document.querySelector('.form').classList.add('hide');
    document.querySelector('.result').innerText = `${data.messege}`;
    document.querySelector('.result').style.color = 'green';
  } else {
    document.querySelector('.result').innerText = `${data.messege}`;
    document.querySelector('.result').style.color = 'red';
  }
  setTimeout(() => {
    formHiddenFalse();
  }, 3000);

  document.getElementById('todo-name').value = '';
  document.getElementById('todo-date').value = '';
  document.getElementById('todo-time').value = '';
});




const putRequestForDataFetching = async (todoName, todoDate, todoTime, isTodoCompleted) => {
  

    const response = await fetch('http://localhost:3000/UpdateTodo', {
      method: 'PUT',
      body: JSON.stringify({
        todoName,
        todoDate,
        todoTime,
        isTodoCompleted
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

   
     await response.json();
     if(response.ok){
       window.location.href ='http://localhost:3000/home'
     }
 
};



document.querySelector('#Your-TODOs').addEventListener('click', async () => {

  document.querySelectorAll('.todo-item,.todoes-list').forEach((item)=>{item.classList.remove('hide')})
  document.querySelectorAll('.Add-TODO-data,.todo-item-completed,.completed-todoes-list,.content,.empty-todo').forEach((item) => {
    item.classList.add('hide')
  })

  const response = await fetch('http://localhost:3000/unCompletedTodoes');
  const data = await response.json();

  if (!response.ok) {
    document.querySelector('.todoes-list').innerHTML = `${data.messege} <a href="http://localhost:3000/login">LogIn</a>`;
    document.querySelector('.todoes-list').style ="color:black; text-align:center ; margin-top:55px; font-weight:700; font-size:larger";
    return;
  }

  const todoItemsArray = data.map((item) => {
    return `
          <div class="todo-item" >
            <h3>${item.todoName}</h3>
            <p>Date: ${item.todoDate}</p>
            <p>Time: ${item.todoTime}</p>
            <p>Status: ${item.isTodoCompleted}</p>
          </div>
        `;
  });
  if(todoItemsArray.length===0){
    document.querySelector('.empty-todo').classList.remove('hide')
    document.querySelector('.empty-todo').innerText="you have not any todo yet add todo first !"
    document.querySelector('.empty-todo').style = "color:black; font-weight:800; font-size:larger ; margin-top:50px; text-align:center"
    return
  }

 const todoUpdatedWhileCompleted=()=>{
    const now = new Date();
    let hours = now.getHours(); 
    let minutes = now.getMinutes();
   let year = now.getFullYear();
   let month = now.getMonth() + 1;
   let day = now.getDate();

   if (month < 10) month = '0' + month;
   if (day < 10) day = '0' + day;

   let currentDate=`${year}-${month}-${day}`;
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let currentTime=`${hours}:${minutes}`
    data.map((item)=>{
      if ((item.todoTime).toString() == currentTime && (item.todoDate).toString() == currentDate){
      
       putRequestForDataFetching(item.todoName, item.todoDate,item.todoTime, "Completed");
     }
    })
  }
  todoUpdatedWhileCompleted();
  document.querySelector('.todoes-list').innerHTML = todoItemsArray.join('');
});

const deleteTodoItem=async(obj)=>{
  const response = await fetch('http://localhost:3000/delete-todo',{
    method:"DELETE",
    body:JSON.stringify(obj),
    headers:{
      "content-type":"application/json",
    }

  })
   await response.json();
  if(response.ok){
    window.location.href='/home';
  }
}






document.querySelector('#Completed-TODOs').addEventListener('click',async()=>{
  document.querySelectorAll('.todo-item-completed,.completed-todoes-list').forEach((item) => { item.classList.remove('hide') })
  document.querySelectorAll('.Add-TODO-data,.todo-item,.todoes-list,.content,.empty-todo').forEach((item) => {
    item.classList.add('hide')
  })
  const response = await fetch("http://localhost:3000/completedTodoes");
  const data=await response.json()
  if(!response.ok){
    return
  } 
  const DeleteItem = (item) => {
    const currentDate = new Date();
    let day=currentDate.getDate();
    let month = currentDate.getMonth();
    const year=currentDate.getFullYear();
    month=month+1;
    if(day<=9){
      day='0'+day;
    }
    if(month<=9){
      month='0'+month;
    }
    let hours=currentDate.getHours();
    let minitus=currentDate.getMinutes();
    if(hours<=9){
       hours='0'+hours;
    }
    if (minitus <= 9) {
      minitus = '0' + minitus;
    }
    const [todoYear,todoMonth,todoDay] = item.todoDate.split('-').map(Number);
    let currentDay = todoDay + 1;;
   let currentMonth=todoMonth;
   if(currentMonth<=9 ){
    currentMonth='0'+currentMonth;
   }
   if(currentDay>30 || (currentMonth=='02' && currentDay>28)){
     currentDay=1;
   }
   if(currentDay<=9){
  currentDay='0'+currentDay;
   }
  const currentTimeNow=`${hours}:${minitus}`;
  const todoCurrentDate=`${currentDay}/${currentMonth}/${todoYear}`
  const currentDateNow = `${day}/${month}/${year}`
  if((currentDateNow===todoCurrentDate) && (currentTimeNow===item.todoTime)){
    deleteTodoItem(item);
  }
  };
  const completedTodoesArrayList=data.map((item)=>{
    DeleteItem(item);
    return `
          <div class="todo-item-completed" >
            <h3>${item.todoName}</h3>
            <p>Date: ${item.todoDate}</p>
            <p>Time: ${item.todoTime}</p>
            <p>Status: ${item.isTodoCompleted}</p>
          </div>
        `;
  })

  if (completedTodoesArrayList.length === 0) {
    document.querySelector('.empty-todo').classList.remove('hide')
    document.querySelector('.empty-todo').innerText = "you have not any completed todo yet complete todo first !"
    document.querySelector('.empty-todo').style="color:black; font-weight:800; font-size:larger ; margin-top:50px; text-align:center"
    return
  }
  document.querySelector('.completed-todoes-list').innerHTML=completedTodoesArrayList.join('');
})








document.querySelector('.logout-button').addEventListener('click',async()=>{
  const response = await fetch('http://localhost:3000/userLogout',{
    method:"POST",
    headers:{
      'content-type':'application/json'
    }
  })
  const data=await response.json()
  if(data){
    window.location.href ='http://localhost:3000/login';
  }
})
window.addEventListener('load',()=>{
  let tokenSaved = document.cookie.split('=')[1]
  if(!tokenSaved){
    window.location.href='/login'
  }
})