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
    res.setHeader("X-myName","Pranjal Martian")  //we can create a custom response header 
    //always add X to custom headers 
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
    if(!user[0]){
        res.status(404).json({msg:"User not found!!"})
    }else{
        return res.json(user[0]);
    }
    

})

app.route('/api/users').post((req,res)=>{
    const body=req.body;
    console.log(body);
     if(!body || !body.first_name||!body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({msg: "All fields are required!!"})
     }  
    users.push({id:users.length+1,...body});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users,null,2),(err,data)=>{
        return res.status(201).json({status:"added new user"}); 
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
        return res.status(201).json({status:`updated ${users[userIndex]} fields`}); 
    })


})
.delete((req,res)=>{
    const user_id=parseInt(req.params.id)
    const userIndex=users.findIndex(user=>{
        return user.id===user_id
    })
    if(userIndex===-1) return res.status(404).json({status:"error",message:"User not found"});
    let deleted_user=users[userIndex]
    users.splice(userIndex,1);

    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users,null,2),(err,data)=>{
        res.status(200).json({msg :` id_${deleted_user.id} : ${deleted_user.first_name} deleted successfully`});
    })


})

app.listen(PORT ,()=>{
    console.log(`Server started at PORT ${PORT}`)
}
)