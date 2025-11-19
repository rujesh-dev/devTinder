const express = require('express');

const app = express();


// app.use('/hello',(req, res)=>{
//     res.send('Hello......');
// })

// app.use('/hello/2',(req, res)=>{
//     res.send('Hello 2......');
// })




// app.use('/',(req, res)=>{
//     res.send('Hello devs......');
// })


app.get('/user', (req, res)=>{
    res.send({name:'Rujesh', age:25})
})

app.post('/user', (req, res)=>{
    res.send('Post request is called')
})


app.delete('/user', (req, res)=>{
    res.send('Deleted...')
})






app.listen(3000, ()=>{
    console.log('server is created successfully');
    
})
 