import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import indexRoute from './src/index.js';
import ValidateRule from './src/validateRuleRoute.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

const validateRule = new ValidateRule();
 
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

const swaggerOptions = {
    swaggerDefinition: {
        info: {
           title: 'Rule Validation API',
           description: 'Test API for rule validation',
           contact: {
               name: 'Assurance Femi',
               email: 'assurancefemi@gmail.com'
           },
           servers: [`https://assurancerulevalidationapi.herokuapp.com/`]
        }
    },
    // ["./routes/*.js"]
    apis: ["app.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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

/**
 * @swagger
 * /:
 *  get:
 *   description: Get contact information (github profile, email, etc.)
 *   summary: Get contact info
 *   responses:
 *    '200':
 *     description: A successful response, contact info displayed
 */
app.get('/', indexRoute);

//POST: Validate Rule 
// 2/

/**
 * @swagger
 * definitions:
 *  Fields:
 *   type: object
 *   properties:
 *    rule: 
 *     type: object
 *     properties: 
 *      field:
 *       type: string
 *       example: 'missions'
 *      condition:
 *       type: string
 *       example: 'gte'
 *      condition_value:
 *       type: number
 *       example: 30
 *     description: rule field
 *    data: 
 *     type: object
 *     properties: 
 *      name:
 *       type: string
 *       example: 'Assurance Femi'
 *      crew:
 *       type: string
 *       example: 'Rocinante'
 *      age:
 *       type: number
 *       example: 30
 *      position:
 *       type: string
 *       example: 'captain'
 *      missions:
 *       type: number
 *       example: 45
 *     description: data field
 */
 

 
 /**     
 * @swagger
 * /validate-rule:
 *  post:
 *   description: The route should accept JSON data containing a rule and data field to validate the rule against. 
 *   summary: Validate rule
 *   parameters: 
 *    - in: body
 *      name: body
 *      required: true
 *      description: body of fields
 *      schema: 
 *       $ref: '#/definitions/Fields'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Fields'

 *   responses:
 *    200:
 *     description: Rule validated successfully
 *    400:
 *     description: Rule validation failed
 */
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