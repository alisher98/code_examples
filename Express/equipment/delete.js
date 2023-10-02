const libApi = require('libs/api');
const moduleModel = require("models/module");
const helper = require('libs/helper');
const config = require('config');
const libPermission = require("libs/permissions");
const libValidator = require('libs/validator');
const ModuleEquipmentClass = require("libs/class/generator/moduleEquipments");
const knex = require('knex')({
    client: 'mysql'
});

/**
 * @api {post} /v1/quote/delete Delete
 * @apiDescription Delete Quote
 * @apiGroup Quote
 *
 * @apiParam {Array} id Quote id(s)
 * @apiParam {Number} user_id="Token user" User id
 *
 * @apiSuccess {Number} res Result flag, 1.
 * @apiSuccess {Object} data list data.
 *
 * @apiError (Error 200) {Number} res Result flag, 0.
 * @apiError (Error 200) {String} error  Error text.
 */


var actionFunction = function (req, res, actionCallback) {

    const i18n = require("libs/i18n");

    i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')));
    let validator = new libValidator(i18n);
    validator.addRules(req.body, [
        {
            name: "id",
            rule: "notEmpty"
        },
        {
            name: "id",
            rule: "notNull"
        },
        {
            name: "id",
            rule: "isArray"
        },
        {
            name: "user_id",
            rule: "notEmpty"
        },
        {
            name: "user_id",
            rule: "isInt",
            options: {
                gt: 0
            }
        }
    ]);

    validator.validate(actionCallback, function () {

        req.responseAction = null;

        var options = {
            functions: [
                deleteEntity,
            ],
            cache: {
                name: null
            },
            callback: actionCallback,
            workflow: {
                filename: __filename
            },
            permissions : {
                module : moduleModel.CONST_MODULE_EQUIPMENT,
                action : libPermission.ACTION_DELETE
            }
        };

        var layout = require(req.app.locals.appPath + "/traits/layouts/dbOnlyLayout");
        layout(req, options);

        function deleteEntity(asyncObj, eachCallback) {

            let libActivities = require("libs/activities");

            (async() => {
                try {
                    let moduleEquipment = new ModuleEquipmentClass({connection : asyncObj.connection, view : "Details", i18n: i18n, userId : req.jwt.token.uid, jwt : req.jwt.token});
                    await moduleEquipment.deleteEntities(req, libActivities);
                    eachCallback(null, asyncObj);
                } catch(e) {
                    console.error(e);
                    eachCallback(libApi.convertErrorToObject(e), asyncObj);
                }
            })()

        }

    })


};

exports.action = actionFunction;


exports.post = function (req, res, next) {

    actionFunction(req, res, function (context, err, data) {
        libApi.restResponse(res, req, err, data);
    })
};
