const express=require('express')
const app=express()
const PORT=8000;
const fs=require('fs')
const users=require('./MOCK_DATA.json')
//middlewares
app.use(express.urlencoded({extended:false}))

app.use((req,res,next)=>{
    console.log("Hello from middleware 1") // if not used next() ,it will hold the req and neither it will send response back nor call next middlware or req handler function
    
    fs.appendFile('log.txt',`${new Date()} : ${req.method} : ${req.path}\n`,(err,data)=>{
        next(); 
    })

    //res.json({msg:"ola from middleware 1"})     //will send response without going to req handler function
    
})



//routes
app.get('/api/users',(req,res)=>{
    return res.json(users)
})
app.get('/users',(req,res)=>{
    const html=`
    <ul>
        ${users.map((u)=>
        `<li>${u.first_name}</li>`
        ).join("")}
    </ul>
    `
    return res.send(html)
})

//dynamic path parameters
app.get('/api/users/:id',(req,res)=>{
    const user_id=req.params.id;
    const user=users.filter((u)=>{
        if(u.id==user_id)return true;
        else{
            return false;
        }
    })
    return res.json(user[0]);

})

app.route('/api/users').post((req,res)=>{
    const body=req.body;
    console.log(body);
    users.push({id:users.length+1,...body});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users,null,2),(err,data)=>{
        return res.json({status:"added new user"}); 
    })

})

app.route('/api/users/:id').patch((req,res)=>{
    const user_id=parseInt(req.params.id)
    const body=req.body;
   
    console.log(body);
    const userIndex=users.findIndex(user=>{
       return user.id===user_id
    })
    if(userIndex===-1) return res.status(404).json({status:"error",message:"User not found"});

    users[userIndex]={...users[userIndex],...body}
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users,null,2),(err,data)=>{
        console.log(data);
    })


})
.delete((req,res)=>{
    const user_id=parseInt(req.params.id)
    const userIndex=users.findIndex(user=>{
        return user.id===user_id
    })
    if(userIndex===-1) return res.status(404).json({status:"error",message:"User not found"});

    users.splice(userIndex,1);

    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users,null,2),(err,data)=>{
        res.send("User deleted");
    })


})

app.listen(PORT ,()=>{
    console.log(`Server started at PORT ${PORT}`)
}
)