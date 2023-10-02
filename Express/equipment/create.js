const libApi = require('libs/api');
const libMysql = require('libs/mysql');
const libConfig = require('libs/config');
const libValidator = require('libs/validator');
const crmEntityModel = require("models/crmentity");
const linkModel = require("models/link");
const moduleModel = require("models/module");
const libPermission = require("libs/permissions");
const helper = require('libs/helper');
const dayjs = require('dayjs');
const to = require('await-to-js').default;
const ModuleEquipmentClass = require("libs/class/generator/moduleEquipments");
const knex = require('knex')({
    client: 'mysql'
});
const i18n = require("libs/i18n");
const config = require("config");

/**
 * @api {get} /v1/equipment/create Create Equipment
 * @apiGroup Equipment
 *
 * @apiParam {Object} body PO body, equivalent <a href='#api-PO-GetV1PoDetails'>Response.body</a>
 * @apiParam {Object} address PO address, equivalent <a href='#api-PO-GetV1PoDetails'>Response.address</a>
 * @apiParam {Object} partsList PO partsList, equivalent <a href='#api-PO-GetV1PoDetails'>Response.partsList</a>
 *
 * @apiSuccess {Number} res Result flag, 1.
 * @apiSuccess {Object} data  Response data.
 * @apiSuccess {Number} data.id  PO id.
 * @apiSuccess {String} data.url  PO url.
 *
 * @apiError (Error 200) {Number} res Result flag, 0.
 * @apiError (Error 200) {String} error  Error text.
 */


var actionFunction = function (req, res, actionCallback) {

    const vtiger_equipment = require("tables/vtiger_equipments");
    // const vtiger_equipmentcalibrations = require("tables/vtiger_equipmentcalibrations");
    const vtiger_crmentity = require("tables/vtiger_crmentity");

    i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')))
    let validator = new libValidator(i18n);
    validator.addRules(req.body, [
        {
            name: "body",
            rule: "notEmpty",
        },
    ]);

    validator.validate(actionCallback, function () {

        req.responseAction = [];

        var options = {
            functions: [
                validateInput,
                createNumber,
                createBody,
                createObj
            ],
            db: {
                type: libMysql.const.writeType
            },
            callback: actionCallback,
            workflow: {
                filename: __filename
            },
            permissions : {
                module : moduleModel.CONST_MODULE_EQUIPMENT,
                action : libPermission.ACTION_CREATE
            }
        };

        var layout = require(req.app.locals.appPath + "/traits/layouts/dbOnlyLayout");
        layout(req, options);

        function validateInput(asyncObj, eachCallback) {
            let errors = [];
            let objValidator = null;

            i18n.setLocale(helper.getNotNull(req, "jwt.token.lang", config.get('i18n.defaultLanguage')))
            objValidator = new libValidator(i18n);
            objValidator.addRules(req.body, [
                {
                    name: "body.assigned_to.assigned_id",
                    rule: "notEmpty"
                },
                {
                    name: "body.product.productid",
                    rule: "notEmpty"
                },
            ]);

            if(!objValidator.validateSync()) {
                errors = errors.concat(objValidator.getErrors());
            }

            if(errors.length > 0) {
                logger.info("Validate Error");
                eachCallback(errors.join("\n"), asyncObj);
            } else {
                logger.info("Validate OK");
                eachCallback(null, asyncObj);
            }
        }

        function createNumber(asyncObj, eachCallback) {

            logger.info('Create Equipment');

            let description = libConfig.get("equipment.description.default", req.jwt.token.cid);

            let entityModel = new crmEntityModel();

            entityModel.createEntityWithNumericDeleted(asyncObj.connection, "Equipment", "#entityNumber#", helper.getNotNull(req.body,"body.description", description), req.body.user_id, helper.get(req.body,"body.assigned_to.assigned_id", null), "vtiger_equipments.equipmentid", (err, entityId, entityNumber) => {
                if (err) {
                    asyncObj.connection.rollback(function () {
                        eachCallback(err, asyncObj)
                    });
                } else {
                    //console.log("Q" + entityNumber);
                    req.body.crm_id = entityId;
                    req.body.number = entityNumber;
                    eachCallback(null, asyncObj);
                }
            })

        }


        function createObj(asyncObj, eachCallback) {

            let queries = [];

            // hide deleted flag
            queries.push(knex(vtiger_crmentity.table).update(vtiger_crmentity.columns.deleted, 0).where(vtiger_crmentity.columns.crmid, req.body.crm_id).toString());

            // body
            queries.push(knex(vtiger_equipment.table).insert( helper.get(asyncObj, "query.body")).toString());

            console.log(queries);

            libMysql.executeWithTransaction(asyncObj, req.body.user_id, queries, (err) => {
                if(err) {
                    console.error(err);
                    eachCallback("DB error", asyncObj)
                } else {
                    console.log("OK");

                    // activities
                    var libActivities = require("libs/activities");

                    libActivities.setActivity(req, 'c', req.body.crm_id, null, moduleModel.CONST_MODULE_EQUIPMENT, {
                        quote_id : req.body.crm_id,
                        quote_no : req.body.body.eid
                    },
                        "Create Equipment <a href='#url#'>" + helper.get(req.body, 'body.eid') + "</a>", req.body.user_id, null);

                    req.responseAction = {
                        id :  req.body.crm_id,
                        url : linkModel.getLink(moduleModel.CONST_MODULE_EQUIPMENT, req.body.crm_id)
                    };
                    eachCallback(null, asyncObj);
                }
            })

        }

        function createBody(asyncObj, eachCallback) {

            (async() => {
                try {
                    console.log("Body");
                    let moduleEquipments = new ModuleEquipmentClass({connection : asyncObj.connection, view : "Details", i18n: i18n, userId : req.jwt.token.uid, jwt : req.jwt.token});
                    let data;
                    [, data] = await to(moduleEquipments.createEntity(req.body));
                    
                    let insert = {};
                    insert[vtiger_equipment.columns.equipmentid] = req.body.crm_id;
                    insert[vtiger_equipment.columns.productid] = helper.get(req.body, "body.product.productid", null);
                    insert[vtiger_equipment.columns.model] = helper.get(req.body, "body.model", null);
                    insert[vtiger_equipment.columns.size] = helper.get(req.body, "body.size", null);
                    insert[vtiger_equipment.columns.eid] = helper.get(req.body, "body.eid", null);
                    insert[vtiger_equipment.columns.serial] = helper.get(req.body, "body.serial", null);
                    insert[vtiger_equipment.columns.type] = helper.get(req.body, "body.type", null);
                    insert[vtiger_equipment.columns.location] = helper.get(req.body, "body.location", null);
                    insert[vtiger_equipment.columns.department] = helper.get(req.body, "body.department", null);
                    insert[vtiger_equipment.columns.calibrationf] = helper.get(req.body, "body.calibrationf", null);
                    insert[vtiger_equipment.columns.donated] = helper.get(req.body, "body.donated", 0);
                    insert[vtiger_equipment.columns.scraped] = helper.get(req.body, "body.scraped", 0);
                    insert[vtiger_equipment.columns.dsdate] = helper.get(req.body, "body.dsdate", null);
                    insert[vtiger_equipment.columns.note] = helper.get(req.body, "body.note", null);
                    insert[vtiger_equipment.columns.is_monitor] = helper.get(req.body, "body.is_monitor", null);

                    helper.set(asyncObj, "query.body", Object.assign({}, data, insert));

                    eachCallback(null, asyncObj);

                } catch(error) {
                    console.error(error);
                    eachCallback(libApi.convertErrorToObject(error), asyncObj);
                }

            })()

        }

    });


};

exports.action = actionFunction;

exports.post = function (req, res, next) {

    actionFunction(req, res, function (context, err, data) {
        libApi.restResponse(res, req, err, data);
    })
};
