const indexRoute = (req, res)=> {
    const myData = {
        name: "Assurance Fagbolagun",
        github: "@hershur",
        email: "assurancefemi@gmail.com",
        mobile: "08160149309",
        twitter: ""
    };

    const baseResponse = {
        message: "My Rule-Validation API",
        status: "success",
        data: myData
    };

    return res.json(baseResponse);
};

export default indexRoute;