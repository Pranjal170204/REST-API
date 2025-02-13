const express=require('express')
const app=express()
const PORT=8000;
const users=require('./MOCK_DATA.json')
//ROUTES


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

app.route("./api/users/:id")
.post((req,res)=>{
    res.json({status:"pending"})
})
.patch((req,res)=>{

})
.delete((req,res)=>{
    
})

app.listen(PORT ,()=>{
    console.log(`Server started at PORT ${PORT}`)
}
)