import _ from 'lodash';

const  isEmpty = (value)=> {
    return value === undefined || value === null || value === NaN 
    || (typeof value === 'object' && Object.keys(value).length === 0) 
    || (typeof value === 'string' && value.trim().length === 0);
};



class ValidateRule {
    // a/
    checkFields(req, res, next) {
        if(!isEmpty(req.body) && _.isObject(req.body)){
            const reqFields = ['rule', 'data'];
            for(const field of reqFields){
                if(!(field in req.body) || isEmpty(req.body[field])){
                    res.status(400);
                    return res.json({
                        message: `${field} is required.`,
                        status: "error",
                        data: null
                    }); 
                }
            }
            // for (const reqBody in req.body){
            //     if(_.isEmpty(req.body[reqBody])) {
            //         res.status(400);
            //         return res.json({
            //             message: `${reqBody} is required`,
            //             status: "error",
            //             data: null
            //         });
            //     }
            // }
            next();
        } else {
            res.status(400);
            return res.json({
                message: "Invalid JSON payload passed.",
                status: "error",
                data: null
            });
        }
        
    }

    checkRuleField (req, res, next) {
        const conditionValues = ['eq', 'neq', 'gt', 'gte', 'contains'];
        const validCondition = conditionValues.includes(req.body.rule.condition);
        const reqFields = ['field', 'condition', 'condition_value'];

        // if((req.body.rule).constructor !== Object) {
        //     res.status(400);
        //     return res.json({
        //         message: "rule should be an object",
        //         status: "error",
        //         data: null
        //     });
        // }

        for(const field of reqFields) {
            if(!(field in req.body.rule) ||  isEmpty(req.body.rule[field])){
                res.status(400);
                return res.json({
                    message: `field '${field}' is missing from data.`,
                    status: "error",
                    data: null
                }); 
            } else if (!validCondition){
                res.status(400);
                return res.json({
                    message: `Accepted condition values are ${conditionValues.join(', ')}.`,
                    status: "error",
                    data: null
                }); 
            } 
            // console.log(req.body.rule[field]);
        }
        next();
    }

    checkFieldDataType(req, res, next){
        const dataTypes = {rule: ['object'], data: ['object','string','array'] };

        for(const fieldDataType in dataTypes){
            
            if(!dataTypes[fieldDataType].includes(typeof req.body[fieldDataType])){
                res.status(400);
                return res.json({
                    message: `${fieldDataType} should be an ${dataTypes[fieldDataType].join(' or ').toString()}.`,
                    status: "error",
                    data: null
                });  
            } 
        } 
        next();
    }

    ValidateRule(req, res) {
        const getFieldValue = _.get(req.body.data, req.body.rule.field);
        let checkCondition = false; 

        if(isEmpty(getFieldValue)){
            res.status(400);
            return res.json({
                message: `field '${req.body.rule.field}' is missing from data.`,
                status: "error",
                data: null
            }); 
                
        }

        //Check condition
        switch (req.body.rule.condition) {
            case 'eq':
                checkCondition = +getFieldValue == +req.body.rule.condition_value;
                break;
            case 'neq':
                checkCondition = +getFieldValue != +req.body.rule.condition_value;
                break;
            case 'gt':
                checkCondition = +getFieldValue > +req.body.rule.condition_value;
                break;
            case 'gte':
                checkCondition = +getFieldValue >= +req.body.rule.condition_value;
                break;
            case 'contains':
                checkCondition = getFieldValue.toString().includes(req.body.rule.condition_value);
                break;
        
            default:
                break;
        }


        if(checkCondition){
            res.status(200);
            return res.json({ 
                "message": `field ${req.body.rule.field} successfully validated.`,
                "status": "success",
                "data": {
                    "validation": {
                    "error": false,
                    "field": `${req.body.rule.field}`,
                    "field_value": `${getFieldValue}`,
                    "condition": `${req.body.rule.condition}`,
                    "condition_value": `${req.body.rule.condition_value}`
                    }
                }
            });
        } else {
            res.status(400);
            return res.json({ 
                "message": `field ${req.body.rule.field} failed validation.`,
                "status": "error",
                "data": {
                    "validation": {
                    "error": false,
                    "field": `${req.body.rule.field}`,
                    "field_value": `${getFieldValue}`,
                    "condition": `${req.body.rule.condition}`,
                    "condition_value": `${req.body.rule.condition_value}`
                    }
                }
            });
        }
    }

} 

export default ValidateRule;