//default development port
let PORT = 3000;

if (process.env.NODE_ENV === 'test') 
{
    PORT = 3002;
} 
if (process.env.NODE_ENV === 'production') 
{
    PORT = process.env.PORT;
}

module.exports = { PORT };