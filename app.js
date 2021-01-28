import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import indexRoute from './src/index.js';
import ValidateRule from './src/validateRuleRoute.js';

const validateRule = new ValidateRule();
 
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

//Body Parser middleware
app.use(bodyParser.json());


// 2a/
app.use('/validate-rule', validateRule.checkFields);

// 2e/
app.use('/validate-rule', validateRule.checkFieldDataType);

// 2b/
app.use('/validate-rule', validateRule.checkRuleField);

//GET: Base Route
// 1/
app.get('/', indexRoute);

//POST: Validate Rule 
app.post('/validate-rule', validateRule.ValidateRule);


//Error route
app.use('*', (req, res)=> {
    res.status(404);
    res.json({
        message: "Cannot find what you're looking for...", 
        status: "error", 
        data: null
    });
});

const serverStarted = ()=> console.log(`Server is running on http://${HOST}:${PORT}`);
app.listen(PORT, serverStarted);