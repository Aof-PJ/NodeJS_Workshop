function response_form(res, status, msg, data=[]) {
    form = {
        "status" : status,
        "message" : msg,
        "data" : data
    }
    return res.status(status).send(form);
}
module.exports = response_form;