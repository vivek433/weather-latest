const express=require('express')
const path=require('path')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast')
const app=express()
const port=process.env.PORT || 3000

//define path for express configure
const publicDirectoryPath=path.join(__dirname,'../public')
const viewsPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')
//handlebars engine and views location


app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)
//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>
{
    res.render('index',
    {
        title:'Weather',
        name:'Vivek Kumar Pandey'
    })
})

app.get('/about',(req,res)=>
{
    res.render('about',
    {
        title:'About Me',
        name:'Vivek Kumar Pandey'
    })
})
app.get('/help',(req,res)=>
{
    res.render('help',
    {title:'Help',
       msg:'This is some helpful text.',
       name:'Vivek Kumar Pandey'
    })
})
app.get('',(req,res)=>
{
res.send('Hello express')
})


app.get('/weather',(req,res)=>
{
    if(!req.query.address)
    {
        return res.send({
            error:'You must provide an address'
        })
    }
    geocode(req.query.address,(error,{latitude,longitude,location}={})=>
    {
        if(error)
        {
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData)=>
        {
            if(error)
            {
                return res.send({error})
            }
            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
        })
    })
    // res.send(
    //     {
    //         forecast:'It is snowing',
    //         location:'Philadelphia',
    //         addrress:req.query.address
    //     }
    // )
})

app.get('/help/*',(req,res)=>
{res.render('404',
{
    title:'404',
    name:'Vivek Kumar Pandey',
    errorMessage:'Help article not found'
})

})
app.get('*',(req,res)=>
{res.render('404',
{
    title:'404',
    name:'Vivek Kumar Pandey',
    errorMessage:'Page not found'
})

})
app.listen(port,()=>
{
    console.log('Server is up on port'+ port)
})