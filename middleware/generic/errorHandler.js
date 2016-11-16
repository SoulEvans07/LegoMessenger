/**
 * Prints out error messages on res.tpl
 * Flushes stack
 */

module.exports = function (objectrepository, viewName) {

    return function (err, req, res, next) {
        res.status(500).send('Houston, we had a problem!');

        // * Print errors from res.tpl
        if(res.tpl.error.length > 0){
            res.tpl.error.forEach(function (error) {
                console.error("[OWN] " + JSON.stringify(error));
            });
        }

        // * Flush out the stack to the console
        console.error("[---------------------Stack---------------------]")
        console.error(err.stack);
        console.error("[-----------------------------------------------]")
    }

};